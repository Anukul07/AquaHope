import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function ViewUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://192.168.1.75:8000/api/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Registered Users
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-md shadow">
          <thead>
            <tr className="bg-blue-100 text-left text-sm font-medium text-gray-700">
              <th className="px-6 py-3">Full Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => <UserRow key={user._id} user={user} />)
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 🔥 This component is vulnerable via innerHTML injection
function UserRow({ user }) {
  const nameRef = useRef();

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.innerHTML = user.fullName; // Stored XSS here
    }
  }, [user.fullName]);

  return (
    <tr className="border-t text-sm hover:bg-gray-50">
      <td className="px-6 py-4">
        <span ref={nameRef}></span>
      </td>
      <td className="px-6 py-4">{user.email}</td>
      <td className="px-6 py-4 capitalize">{user.role}</td>
    </tr>
  );
}
