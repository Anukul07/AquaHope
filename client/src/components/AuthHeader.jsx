import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function AuthHeader() {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-4 shadow-sm flex justify-center">
      <img
        src={logo}
        alt="Logo"
        className="h-10 cursor-pointer"
        onClick={() => navigate("/")}
      />
    </div>
  );
}
