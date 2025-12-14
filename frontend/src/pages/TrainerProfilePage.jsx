import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";

const TrainerProfilePage = () => {
  const { trainerId } = useParams();
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loadingFollow, setLoadingFollow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    const load = async () => {
      try {
        const data = await apiRequest(`/trainers/${trainerId}/profile`, {
          token
        });
        setProfile(data);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [trainerId, token, user, navigate]);

  const toggleFollow = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setLoadingFollow(true);
    setError("");
    try {
      if (profile.isFollowing) {
        await apiRequest(`/trainers/${trainerId}/follow`, {
          method: "DELETE",
          token
        });
        setProfile((p) => ({ ...p, isFollowing: false }));
      } else {
        await apiRequest(`/trainers/${trainerId}/follow`, {
          method: "POST",
          token
        });
        setProfile((p) => ({ ...p, isFollowing: true }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingFollow(false);
    }
  };

  if (!user) return null;
  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  const { trainer, isFollowing, plans } = profile;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {trainer.name}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {trainer.specialization || "Trainer"}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {trainer.bio || "No bio provided yet."}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={toggleFollow}
            disabled={loadingFollow}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              isFollowing
                ? "border border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            } disabled:opacity-60`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
          <Link
            to="/feed"
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            Back to Feed
          </Link>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Plans by {trainer.name}
        </h3>
        {plans.length === 0 ? (
          <p className="text-sm text-slate-500">
            This trainer has not created any plans yet.
          </p>
        ) : (
          <div className="space-y-3">
            {plans.map((p) => (
              <div
                key={p._id}
                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm flex items-center justify-between gap-2"
              >
                <div>
                  <h4 className="font-semibold text-slate-900">
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    ₹{p.price} · {p.durationDays} days
                  </p>
                </div>
                <Link
                  to={`/plans/${p._id}`}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View Plan
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerProfilePage;
