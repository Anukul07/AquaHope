// src/pages/admin/ProtectedAdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

export default function ProtectedAdminRoute() {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/api/auth/check-role");
        setIsAuthorized(res.data.role === "admin");
      } catch {
        setIsAuthorized(false);
      }
    })();
  }, []);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }
  return isAuthorized ? <Outlet /> : <Navigate to="/unauthorized" replace />;
}
