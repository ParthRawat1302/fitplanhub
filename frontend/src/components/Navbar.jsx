import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="text-lg font-semibold text-indigo-600 tracking-tight"
        >
          FitPlanHub
        </Link>


        <div className="flex items-center gap-4 text-sm">
           {/* Home link (visible button-like link) */}
          <Link
            to="/"
            className="text-slate-600 hover:text-indigo-600"
          >
            Home
          </Link>
          {user && user.role === "trainer" && (
            <Link
              to="/trainer/dashboard"
              className="text-slate-600 hover:text-indigo-600"
            >
              Trainer Dashboard
            </Link>
          )}

          {user && (
            <Link
              to="/feed"
              className="text-slate-600 hover:text-indigo-600"
            >
              My Feed
            </Link>
          )}

          {!user && (
            <Link
              to="/auth"
              className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
            >
              Login / Signup
            </Link>
          )}

          {user && (
            <>
              <span className="hidden sm:inline text-slate-500">
                {user.name}{" "}
                <span className="text-xs uppercase tracking-wide text-slate-400">
                  ({user.role})
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 text-sm hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
