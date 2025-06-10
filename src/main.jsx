import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DetailMenuPage from "./pages/DetailMenuPage.jsx";
import AddMenuPage from "./pages/AddMenuPage.jsx";
import OrderConfirmation from "./pages/OrderConfirmationPage.jsx";
import PaymentInstruction from "./pages/PaymentInstruction.jsx";
import { CartPage } from "./pages/CartPage.jsx";
import CustomerData from "./pages/CustomerData.jsx";
import AdminLoginPage from "./pages/LoginAdminPage.jsx";
import RegisterAdminPage from "./pages/RegisterAdminPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import EditMenuPage from "./pages/EditMenuPage.jsx";
import AdminMainDashboard from "./pages/AdminMainDashboard.jsx";
import StatisticPage from "./pages/StatisticPage.jsx";
import CreateMenuPage from "./pages/CreateMenuPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx"; // pastikan ini ada

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/detail" element={<DetailMenuPage />} />
        <Route path="/add-menu" element={<AddMenuPage />} />
        <Route path="/confirmation" element={<OrderConfirmation />} />
        <Route path="/payment-instruction" element={<PaymentInstruction />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/customer-data" element={<CustomerData />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-register" element={<RegisterAdminPage />} />
        <Route path="/admin-dashboard" element={<AdminMainDashboard />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/edit" element={<EditMenuPage />} />
        <Route path="/statistic" element={<StatisticPage />} />
        <Route path="/create" element={<CreateMenuPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
