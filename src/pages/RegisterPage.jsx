// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/lunchbylaa.png";

export default function RegisterPage() {
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

    // Ambil daftar akun yang sudah terdaftar dari localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Cek apakah email sudah terdaftar
    const existingUser = storedUsers.find((u) => u.email === trimmedEmail);
    if (existingUser) {
      setErrorMessage("Email sudah terdaftar!");
      return;
    }

    // Tambahkan akun baru
    const newUsers = [
      ...storedUsers,
      { email: trimmedEmail, password: trimmedPassword },
    ];
    localStorage.setItem("users", JSON.stringify(newUsers));

    // Redirect ke halaman login
    navigate("/login");
  };

  return (
    <div className="page-wrapper">
      <div className="register-container">
        <div className="register-form">
          <img src={logo} alt="Admin Icon" className="admin-icon" />
          <h2>Sign Up for Admin</h2>

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

            <button type="submit">Sign Up</button>
          </form>

          <p className="login-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
