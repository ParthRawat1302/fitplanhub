import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";

const PlanDetailsPage = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setError("Please login to view plan details.");
      return;
    }
    const load = async () => {
      try {
        const d = await apiRequest(`/plans/${id}`, { token });
        setData(d);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [id, token, user]);

  const handleSubscribe = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await apiRequest(`/subscriptions/${id}`, {
        method: "POST",
        token
      });
      const d = await apiRequest(`/plans/${id}`, { token });
      setData(d);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <p className="mb-3 text-sm text-slate-600">{error}</p>
        <Link
          to="/auth"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  const { previewOnly, plan } = data;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {plan.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Trainer:{" "}
              <span className="font-medium text-slate-700">
                {plan.trainer?.name || plan.trainerName}
              </span>
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="text-slate-600">
              <span className="font-semibold">₹{plan.price}</span>
            </p>
            <p className="text-xs text-slate-500">
              {plan.durationDays} days
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4 text-sm">
          {previewOnly ? (
            <>
              <p className="text-slate-600 mb-3">
                You have not subscribed to this plan yet. Subscribe to unlock
                the full workout details and schedule.
              </p>
              <button
                onClick={handleSubscribe}
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
              >
                {submitting
                  ? "Subscribing..."
                  : "Subscribe (Simulated Payment)"}
              </button>
            </>
          ) : (
            <>
              <h3 className="font-semibold text-slate-900 mb-2">
                Plan Description
              </h3>
              <p className="text-slate-700 whitespace-pre-line">
                {plan.description}
              </p>
            </>
          )}
        </div>

        {plan.trainer && (
          <div className="mt-4 pt-3 border-t border-slate-100 text-sm">
            <Link
              to={`/trainers/${plan.trainer._id}`}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Trainer Profile →
            </Link>
          </div>
        )}

        {error && (
          <p className="mt-3 text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
};

export default PlanDetailsPage;
