import { useEffect, useState } from "react";
import { apiRequest } from "../api";
import PlanCard from "../components/PlanCard";

const LandingPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiRequest("/plans");
        setPlans(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Discover Fitness Plans
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Browse plans from certified trainers. Subscribe to unlock full details.
        </p>
      </div>

      {loading && (
        <p className="text-sm text-slate-500">Loading plans...</p>
      )}

      {error && (
        <p className="text-sm text-red-500">Error: {error}</p>
      )}

      {!loading && !error && (
        <>
          {plans.length === 0 ? (
            <p className="text-sm text-slate-500">No plans yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {plans.map((p) => (
                <PlanCard key={p.id} plan={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LandingPage;
