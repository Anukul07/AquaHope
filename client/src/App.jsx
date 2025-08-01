import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Login from "./pages/auth/Login";
import Registration from "./pages/auth/Registration";
import Homepage from "./pages/Homepage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AdminPanel from "./pages/admin/AdminPanel";
import ViewUsers from "./pages/admin/ViewUsers";
import Donation from "./pages/Donation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Profile from "./pages/Profile";
import ViewCampaigns from "./pages/admin/ViewCampaigns";
import ProtectedAdminRoute from "./pages/admin/ProtectedAdminRoute";

function App() {
  const stripePromise = loadStripe(
    "#"
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminPanel />}>
            <Route path="users" element={<ViewUsers />} />
            <Route path="campaigns" element={<ViewCampaigns />} />
          </Route>
        </Route>
        <Route
          path="/donate/:id"
          element={
            <Elements stripe={stripePromise}>
              <Donation />
            </Elements>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
