import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";

const TrainerDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    durationDays: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "trainer") {
      navigate("/");
      return;
    }
    const load = async () => {
      try {
        const data = await apiRequest("/plans/trainer/me/list", {
          token
        });
        setPlans(data);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [user, token, navigate]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      price: "",
      durationDays: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const body = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      durationDays: Number(form.durationDays)
    };

    try {
      if (editingId) {
        const updated = await apiRequest(`/plans/${editingId}`, {
          method: "PUT",
          body,
          token
        });
        setPlans((ps) => ps.map((p) => (p._id === updated._id ? updated : p)));
      } else {
        const created = await apiRequest("/plans", {
          method: "POST",
          body,
          token
        });
        setPlans((ps) => [created, ...ps]);
      }
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (plan) => {
    setEditingId(plan._id);
    setForm({
      title: plan.title,
      description: plan.description,
      price: String(plan.price),
      durationDays: String(plan.durationDays)
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    try {
      await apiRequest(`/plans/${id}`, { method: "DELETE", token });
      setPlans((ps) => ps.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Trainer Dashboard</h2>
          <p className="text-sm text-slate-500">
            Create and manage your fitness plans.
          </p>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-500">{error}</p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Form */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            {editingId ? "Edit Plan" : "Create New Plan"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            <div className="space-y-1">
              <label className="block text-slate-600">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-600">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                className="w-full h-24 rounded-lg border border-slate-300 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-slate-600">Price (₹)</label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-600">Duration (days)</label>
                <input
                  name="durationDays"
                  type="number"
                  value={form.durationDays}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
              >
                {editingId ? "Update Plan" : "Create Plan"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">
            My Plans
          </h3>

          {plans.length === 0 && (
            <p className="text-sm text-slate-500">
              You have not created any plans yet.
            </p>
          )}

          {plans.map((p) => (
            <div
              key={p._id}
              className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900">
                  {p.title}
                </h4>
                <span className="text-xs text-slate-500">
                  {p.durationDays} days
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-1 line-clamp-2">
                {p.description}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Price: ₹{p.price}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="px-2 py-1 rounded-md border border-slate-300 hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="px-2 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
