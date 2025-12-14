import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";

const LoginSignupPage = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        const data = await apiRequest("/auth/login", {
          method: "POST",
          body: { email: form.email, password: form.password }
        });
        login(data.user, data.token);
      } else {
        const body = {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role
        };
        const data = await apiRequest("/auth/signup", {
          method: "POST",
          body
        });
        login(data.user, data.token);
      }
      navigate("/feed");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg border ${
              mode === "login"
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-transparent text-slate-500 hover:bg-slate-50"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg border ${
              mode === "signup"
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-transparent text-slate-500 hover:bg-slate-50"
            }`}
          >
            Signup
          </button>
        </div>

        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h2>

        {error && (
          <p className="mb-3 text-sm text-red-500">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          {mode === "signup" && (
            <>
              <div className="space-y-1">
                <label className="block text-slate-600">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-600">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="user">User</option>
                  <option value="trainer">Trainer</option>
                </select>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="block text-slate-600">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-slate-600">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-1 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
          >
            {mode === "login" ? "Login" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginSignupPage;
