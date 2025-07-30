import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import { FiMenu, FiX } from "react-icons/fi";
import { useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;
  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && drawerOpen) {
        setDrawerOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [drawerOpen]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    }
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinkClass = (path) =>
    `hover:text-[#0077b6] transition-colors duration-200 ${
      location.pathname === path
        ? "text-[#0077b6] font-semibold"
        : "text-[#1e1e1e]"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#f9f9f9] shadow-sm font-inter">
      <div className="flex items-center justify-between w-full px-6 py-3">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 w-1/3 justify-start">
          <img
            src={logo}
            alt="AquaHope Logo"
            className="h-12 w-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        {/* Center: Nav Links (desktop only) */}
        <div className="hidden md:flex justify-center w-1/3 gap-10 font-medium">
          {isLoggedIn ? (
            <>
              <Link to="/homepage" className={navLinkClass("/homepage")}>
                Campaigns
              </Link>
              <Link to="/about" className={navLinkClass("/about")}>
                About Us
              </Link>
              <Link to="/profile" className={navLinkClass("/profile")}>
                Profile
              </Link>
              {isAdmin && (
                <Link to="/admin" className={navLinkClass("/admin")}>
                  Admin Panel
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/" className={navLinkClass("/")}>
                Explore Campaigns
              </Link>
              <Link to="/about" className={navLinkClass("/about")}>
                About Us
              </Link>
            </>
          )}
        </div>

        {/* Right: Login/Logout Button (desktop only) */}
        <div className="hidden md:flex w-1/3 justify-end items-center">
          {isLoggedIn ? (
            <span
              onClick={handleLogout}
              className="cursor-pointer text-[#1e1e1e] hover:text-red-500 transition-colors duration-200"
            >
              Logout
            </span>
          ) : (
            <Link
              to="/login"
              className="bg-[#0077b6] hover:bg-[#005f87] text-white px-8 py-2 rounded-full transition-all duration-200"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile: Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setDrawerOpen(true)}>
            <FiMenu className="text-2xl text-[#1e1e1e]" />
          </button>
        </div>
      </div>

      {/* Mobile Side Drawer */}
      {drawerOpen && (
        <div className="fixed top-0 right-0 w-64 h-full bg-[#f9f9f9] shadow-lg z-50">
          <div className="flex justify-between items-center px-4 py-4 border-b">
            <h2 className="text-xl font-semibold text-[#0077b6]">Menu</h2>
            <button onClick={() => setDrawerOpen(false)}>
              <FiX className="text-2xl text-[#1e1e1e]" />
            </button>
          </div>
          <div className="flex flex-col p-4 gap-4 font-medium">
            {isLoggedIn ? (
              <>
                <Link
                  to="/homepage"
                  onClick={() => setDrawerOpen(false)}
                  className={navLinkClass("/homepage")}
                >
                  Campaigns
                </Link>
                <Link
                  to="/about"
                  onClick={() => setDrawerOpen(false)}
                  className={navLinkClass("/about")}
                >
                  About Us
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setDrawerOpen(false)}
                  className={navLinkClass("/profile")}
                >
                  Profile
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setDrawerOpen(false)}
                    className={navLinkClass("/admin")}
                  >
                    Admin Panel
                  </Link>
                )}
                <span
                  onClick={() => {
                    handleLogout();
                    setDrawerOpen(false);
                  }}
                  className="cursor-pointer text-[#1e1e1e] hover:text-red-500 transition-colors duration-200"
                >
                  Logout
                </span>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  onClick={() => setDrawerOpen(false)}
                  className={navLinkClass("/")}
                >
                  Explore Campaigns
                </Link>
                <Link
                  to="/about"
                  onClick={() => setDrawerOpen(false)}
                  className={navLinkClass("/about")}
                >
                  About Us
                </Link>
                <Link
                  to="/login"
                  onClick={() => setDrawerOpen(false)}
                  className={`hover:text-[#0077b6] ${
                    location.pathname === "/login"
                      ? "text-[#0077b6] font-semibold"
                      : ""
                  }`}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
