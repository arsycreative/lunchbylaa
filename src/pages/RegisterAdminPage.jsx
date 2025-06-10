import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminLogo from "../assets/lunchbylaa.png";
import "./RegisterAdminPage.css";

export default function RegisterAdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage("Email dan password wajib diisi!");
      return;
    }

    const existingAdmins = JSON.parse(localStorage.getItem("admins")) || [];
    const alreadyExists = existingAdmins.some(
      (admin) => admin.email === trimmedEmail
    );

    if (alreadyExists) {
      setErrorMessage("Admin dengan email ini sudah terdaftar.");
      return;
    }

    const newAdmin = { email: trimmedEmail, password: trimmedPassword };
    const updatedAdmins = [...existingAdmins, newAdmin];

    localStorage.setItem("admins", JSON.stringify(updatedAdmins));
    navigate("/admin-login");
  };

  return (
    <div className="register-admin-wrapper">
      <div className="register-admin-container">
        <img src={adminLogo} alt="Admin Logo" className="register-admin-logo" />
        <h2 className="register-admin-title">Sign Up for Admin</h2>

        <form onSubmit={handleRegister}>
          <div className="register-admin-input-group">
            <span className="register-admin-input-icon">📧</span>
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

          <div className="register-admin-input-group">
            <span className="register-admin-input-icon">🔒</span>
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

          {errorMessage && (
            <p className="register-admin-error">{errorMessage}</p>
          )}

          <button type="submit" className="register-admin-button">
            Sign Up
          </button>
        </form>

        <p className="register-admin-redirect">
          Already have an account?{" "}
          <span onClick={() => navigate("/admin-login")}>Login</span>
        </p>
      </div>
    </div>
  );
}
