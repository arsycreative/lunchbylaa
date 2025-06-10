import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminMainDashboard.css";
import HalloAdminIcon from "../components/icons/HalloAdminIcon";
import profilePic from "../assets/profile.png";
import bookLover from "../assets/book-lover.png";

const AdminMainDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-main-dashboard">
      <header className="admin-main-dashboard__header">
        <h1 className="admin-main-dashboard__greeting">
          <HalloAdminIcon />
        </h1>
        <img
          src={profilePic}
          alt="Admin Avatar"
          className="admin-main-dashboard__avatar"
        />
      </header>

      <div className="admin-main-dashboard__cards">
        <div
          className="admin-main-dashboard__card"
          onClick={() => navigate("/admin")}
        >
          <h2 className="admin-main-dashboard__card-title">UPDATE MENU</h2>
          <p className="admin-main-dashboard__card-subtitle">
            Update Menu dan Harga
          </p>
          <img
            src={bookLover}
            alt="Update Menu"
            className="admin-main-dashboard__card-image"
          />
        </div>

        <div
          className="admin-main-dashboard__card"
          onClick={() => navigate("/create")}
        >
          <h2 className="admin-main-dashboard__card-title">TAMBAH MENU</h2>
          <p className="admin-main-dashboard__card-subtitle">
            Menambahkan Menu Baru
          </p>
          <img
            src={bookLover}
            alt="Tambah Menu"
            className="admin-main-dashboard__card-image"
          />
        </div>

        <div
          className="admin-main-dashboard__card"
          onClick={() => navigate("/statistic")}
        >
          <h2 className="admin-main-dashboard__card-title">REKAP PENJUALAN</h2>
          <p className="admin-main-dashboard__card-subtitle">
            Memonitoring Laporan Penjualan
          </p>
          <img
            src={bookLover}
            alt="Rekap Penjualan"
            className="admin-main-dashboard__card-image"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminMainDashboard;
