import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Login from "./pages/auth/Login";
import Registration from "./pages/auth/Registration";
import Homepage from "./pages/Homepage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AdminPanel from "./pages/admin/AdminPanel";
import ViewUsers from "./pages/admin/ViewUsers";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin" element={<AdminPanel />}>
          <Route path="users" element={<ViewUsers />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
