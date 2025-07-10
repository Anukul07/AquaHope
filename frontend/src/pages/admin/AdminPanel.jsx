import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaUsers, FaSignOutAlt } from "react-icons/fa";

export default function AdminPanel() {
  const [active, setActive] = useState("users");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-8">AquaHope Admin</h1>
          <nav className="flex flex-col gap-4">
            <Link
              to="/admin/users"
              onClick={() => setActive("users")}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
                location.pathname === "/admin/users"
                  ? "bg-blue-600 font-semibold"
                  : "hover:bg-blue-700"
              }`}
            >
              <FaUsers /> View Users
            </Link>
            {/* Future links go here */}
          </nav>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md w-full transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
