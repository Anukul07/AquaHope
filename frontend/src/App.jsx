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

function App() {
  const stripePromise = loadStripe(
    "pk_test_51Rq9L0R52fHRjPZNIMH95a98eyaShPMqJqyq0slNPZfjySNLwPrbuwas4JaiyI7ofJNXmryjY8DwDaTQw3sgHneR00rUcR00Bk"
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
        <Route path="/admin" element={<AdminPanel />}>
          <Route path="users" element={<ViewUsers />} />
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
