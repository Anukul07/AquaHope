import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { Users, DollarSign, Target, LogOut, Activity } from "lucide-react";

export default function AdminPanel() {
  const navigate = useNavigate();
  const location = useLocation();

  const stats = {
    totalUsers: 12500,
    activeCampaigns: 18,
    fundsCollected: 575000,
    recentDonations: [
      { id: 1, donor: "Alice Johnson", amount: 150, date: "2024-07-28" },
      { id: 2, donor: "Bob Williams", amount: 500, date: "2024-07-27" },
      { id: 3, donor: "Charlie Davis", amount: 75, date: "2024-07-26" },
      { id: 4, donor: "Diana Miller", amount: 250, date: "2024-07-25" },
    ],
    newUsersToday: 45,
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full font-sans bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-800 text-white p-6 flex flex-col justify-between shadow-lg flex-shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold mb-10 text-emerald-300 text-center md:text-left">
            AquaHope
          </h1>
          <nav className="flex flex-col gap-4">
            {/* Dashboard Link - links to /admin */}
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out text-base md:text-lg ${
                location.pathname === "/admin"
                  ? "bg-emerald-600 text-white font-semibold shadow-md"
                  : "hover:bg-slate-700 text-slate-200"
              }`}
            >
              <Activity className="w-5 h-5" /> Dashboard
            </Link>

            {/* View Users Link */}
            <Link
              to="/admin/users"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out text-base md:text-lg ${
                location.pathname === "/admin/users"
                  ? "bg-emerald-600 text-white font-semibold shadow-md"
                  : "hover:bg-slate-700 text-slate-200"
              }`}
            >
              <Users className="w-5 h-5" /> View Users
            </Link>

            {/* Campaigns Link */}
            <Link
              to="/admin/campaigns"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out text-base md:text-lg ${
                location.pathname === "/admin/campaigns"
                  ? "bg-emerald-600 text-white font-semibold shadow-md"
                  : "hover:bg-slate-700 text-slate-200"
              }`}
            >
              <Target className="w-5 h-5" /> Campaigns
            </Link>
          </nav>
        </div>
        <div className="mt-8 md:mt-0">
          {" "}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl w-full transition-all duration-200 ease-in-out text-white font-semibold shadow-md text-base md:text-lg"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-gray-100">
        {location.pathname === "/admin" && (
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-8">
              Admin Dashboard
            </h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Total Users Card */}
              <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 border border-gray-200">
                <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Active Campaigns Card */}
              <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 border border-gray-200">
                <div className="p-4 bg-green-100 rounded-full text-green-600">
                  <Target className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Active Campaigns
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.activeCampaigns}
                  </p>
                </div>
              </div>

              {/* Total Funds Collected Card */}
              <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 border border-gray-200">
                <div className="p-4 bg-purple-100 rounded-full text-purple-600">
                  <DollarSign className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Funds Collected
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${stats.fundsCollected.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* New Users Today Card (moved here for better grid flow) */}
              <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 border border-gray-200">
                <div className="p-4 bg-yellow-100 rounded-full text-yellow-600">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    New Users Today
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.newUsersToday}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Donations Section */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                Recent Donations
              </h3>
              <ul className="divide-y divide-gray-200">
                {stats.recentDonations.map((donation) => (
                  <li
                    key={donation.id}
                    className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {donation.donor}
                      </p>
                      <p className="text-sm text-gray-500">{donation.date}</p>
                    </div>
                    <p className="text-lg font-bold text-green-600 mt-1 sm:mt-0">
                      ${donation.amount}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
