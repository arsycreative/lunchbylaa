import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DetailMenuPage from "./pages/DetailMenuPage.jsx";
import AddMenuPage from "./pages/AddMenuPage.jsx";
import ConfirmationPage from "./pages/OrderConfirmationPage.jsx";
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

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/detail",
      element: <DetailMenuPage />,
    },
    {
      path: "/add-menu",
      element: <AddMenuPage />,
    },
    {
      path: "/confirmation",
      element: <OrderConfirmation />,
    },
    {
      path: "/payment-instruction",
      element: <PaymentInstruction />,
    },
    {
      path: "/cart",
      element: <CartPage />,
    },
    {
      path: "/customer-data",
      element: <CustomerData />,
    },
    {
      path: "/admin-login",
      element: <AdminLoginPage />,
    },
    {
      path: "/admin-register",
      element: <RegisterAdminPage />,
    },
    {
      path: "/admin-dashboard",
      element: <AdminMainDashboard />,
    },
    {
      path: "/admin",
      element: <AdminDashboardPage />,
    },
    {
      path: "/edit",
      element: <EditMenuPage />,
    },
    {
      path: "/statistic",
      element: <StatisticPage />,
    },
    {
      path: "/create",
      element: <CreateMenuPage />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
