import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminLogo from "../assets/lunchbylaa.png";
import "./LoginAdminPage.css";

export default function LoginAdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const storedAdmins = JSON.parse(localStorage.getItem("admins")) || [];
    const matchedAdmin = storedAdmins.find(
      (admin) =>
        admin.email === email.trim() && admin.password === password.trim()
    );

    if (matchedAdmin) {
      localStorage.setItem("loggedInAdmin", JSON.stringify(matchedAdmin));
      navigate("/admin-dashboard");
    } else {
      setErrorMessage("Email atau password salah.");
    }
  };

  return (
    <div className="login-admin-wrapper">
      <div className="login-admin-container">
        <img src={adminLogo} alt="Admin Logo" className="login-admin-logo" />
        <h2 className="login-admin-title">Login Admin</h2>

        <form onSubmit={handleLogin}>
          <div className="login-admin-input-group">
            <span className="login-admin-input-icon">📧</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage("");
              }}
              required
            />
          </div>

          <div className="login-admin-input-group">
            <span className="login-admin-input-icon">🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage("");
              }}
              required
            />
          </div>

          {errorMessage && <p className="login-admin-error">{errorMessage}</p>}

          <button type="submit" className="login-admin-button">
            Login
          </button>
        </form>

        <p className="login-admin-redirect">
          Don't have an account?{" "}
          <span onClick={() => navigate("/admin-register")}>Register</span>
        </p>
      </div>
    </div>
  );
}
