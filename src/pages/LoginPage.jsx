// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/lunchbylaa.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage("Email dan password wajib diisi!");
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Cari apakah ada user yang cocok
    const matchedUser = storedUsers.find(
      (u) => u.email === trimmedEmail && u.password === trimmedPassword
    );

    if (matchedUser) {
      // Tandai “logged in” di localStorage (bisa Anda sesuaikan)
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));

      // Redirect ke dashboardAdmin (ganti sesuai route Anda)
      navigate("/");
    } else {
      setErrorMessage("Email atau password salah!");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="login-container">
        <div className="login-form">
          <img src={logo} alt="Admin Icon" className="admin-icon" />
          <h2>Log in for Admin</h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <span className="input-icon">📧</span>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => {
                  setErrorMessage("");
                  setEmail(e.target.value);
                }}
              />
            </div>

            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => {
                  setErrorMessage("");
                  setPassword(e.target.value);
                }}
              />
            </div>

            {errorMessage && (
              <p id="error-message" className="error-message">
                {errorMessage}
              </p>
            )}

            <button type="submit">Log in</button>
          </form>

          <p className="signup-link">
            Don’t have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
