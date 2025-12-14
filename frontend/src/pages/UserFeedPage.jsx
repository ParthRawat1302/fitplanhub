import { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const UserFeedPage = () => {
  const { user, token } = useAuth();
  const [feed, setFeed] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    const load = async () => {
      try {
        const data = await apiRequest("/feed", { token });
        setFeed(data);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [user, token, navigate]);

  if (!user) return null;
  if (!feed) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-sm text-slate-500">Loading feed...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">My Feed</h2>
        <p className="text-sm text-slate-500">
          Plans from trainers you follow and plans you have purchased.
        </p>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-500">{error}</p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Followed trainers' plans */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Plans from Trainers You Follow
          </h3>
          {feed.plansFromFollowed.length === 0 ? (
            <p className="text-sm text-slate-500">
              Follow trainers to see their plans here.
            </p>
          ) : (
            <div className="space-y-3">
              {feed.plansFromFollowed.map((p) => (
                <div
                  key={p.id}
                  className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900">
                      {p.title}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {p.durationDays} days
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Trainer:{" "}
                    <span className="font-medium text-slate-700">
                      {p.trainer?.name}
                    </span>
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">
                      Price: ₹{p.price}
                    </span>
                    <Link
                      to={`/plans/${p.id}`}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Purchased plans */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Plans You Purchased
          </h3>
          {feed.purchasedPlans.length === 0 ? (
            <p className="text-sm text-slate-500">
              You have not subscribed to any plans yet.
            </p>
          ) : (
            <div className="space-y-3">
              {feed.purchasedPlans.map((p) => (
                <div
                  key={p.subscriptionId}
                  className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm flex items-center justify-between gap-2"
                >
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Trainer:{" "}
                      <span className="font-medium text-slate-700">
                        {p.trainerName}
                      </span>
                    </p>
                  </div>
                  <Link
                    to={`/plans/${p.planId}`}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Go to Plan
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserFeedPage;
