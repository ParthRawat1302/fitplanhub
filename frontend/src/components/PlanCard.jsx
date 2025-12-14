import { Link } from "react-router-dom";

const PlanCard = ({ plan }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-2">
      <h3 className="text-base font-semibold text-slate-800">
        {plan.title}
      </h3>
      <p className="text-sm text-slate-500">
        Trainer:{" "}
        <span className="font-medium text-slate-700">
          {plan.trainerName}
        </span>
      </p>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Price: <span className="font-semibold">₹{plan.price}</span></span>
        <span>Duration: {plan.durationDays} days</span>
      </div>
      <div className="mt-2">
        <Link
          to={`/plans/${plan.id}`}
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          View details →
        </Link>
      </div>
    </div>
  );
};

export default PlanCard;
