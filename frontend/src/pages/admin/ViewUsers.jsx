import { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Phone,
  MapPin,
  Mail,
  Lock,
  Unlock,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://192.168.1.75:8000/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please check your network or server.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (userId) => {
    try {
      await axios.post(
        `http://192.168.1.75:8000/api/admin/unlockUser/${userId}`
      );

      fetchUsers();
    } catch (err) {
      console.error("Error unlocking user:", err);
      setError("Failed to unlock user. Please try again.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 min-h-[calc(100vh-100px)] flex flex-col">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
        <User className="w-7 h-7 text-blue-600" /> Registered Users
      </h2>

      {loading && (
        <div className="flex flex-col items-center justify-center py-10 text-gray-600">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
          <p>Loading user data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-lg flex items-center gap-3 mb-6">
          <AlertCircle className="w-6 h-6" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-blue-50 border-b border-gray-200">
              <tr className="text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <th className="px-6 py-3">Full Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Province</th>
                <th className="px-6 py-3">Address Line 1</th>
                <th className="px-6 py-3">Address Line 2</th>
                <th className="px-6 py-3">City</th>
                <th className="px-6 py-3">ZIP</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length > 0 ? (
                users.map((user) => {
                  const p = user.profile || {};
                  return (
                    <tr
                      key={user._id}
                      className="transition-colors duration-150 ease-in-out hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {p.phone || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {p.province || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {p.addressLine1 || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {p.addressLine2 || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {p.city || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {p.zipcode || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm capitalize text-gray-700">
                        {user.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.isLocked ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <Lock className="w-3 h-3 mr-1" /> Locked
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Unlock className="w-3 h-3 mr-1" /> Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {user.isLocked && (
                          <button
                            onClick={() => handleUnlock(user._id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                          >
                            <Unlock className="w-4 h-4 mr-1" /> Unlock
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="text-center py-8 text-gray-500 text-lg"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
