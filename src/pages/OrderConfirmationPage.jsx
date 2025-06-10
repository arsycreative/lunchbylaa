import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderConfirmationPage.css";
import BackIcon from "../components/icons/BackIcon";
import TunaiIcon from "../components/icons/TunaiIcon";
import GopayIcon from "../components/icons/GopayIcon";
import DanaIcon from "../components/icons/DanaIcon";
import ShopeePayIcon from "../components/icons/ShopeePayIcon";
import TransferIcon from "../components/icons/TransferIcon";
import PesananIcon from "../components/icons/PesananIcon";
import DollarIcon from "../components/icons/DollarIcon";

const paymentMethods = [
  { icon: <TunaiIcon />, label: "TUNAI", value: "TUNAI" },
  { icon: <DanaIcon />, label: "DANA", value: "DANA" },
  { icon: <GopayIcon />, label: "GOPAY", value: "GOPAY" },
  { icon: <ShopeePayIcon />, label: "SHOPEEPAY", value: "SHOPEEPAY" },
  { icon: <TransferIcon />, label: "TRANSFER", value: "TRANSFER" },
];

const orders = [
  { name: "Ricebowl", qty: 2, price: 30000 },
  { name: "Chips", qty: 1, price: 10000 },
];

const OrderConfirmationPage = () => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const navigate = useNavigate();

  const total = orders.reduce((sum, item) => sum + item.qty * item.price, 0);

  const handleProceed = () => {
    if (!selectedMethod) return;
    navigate("/payment-instruction", {
      state: { orders, total, method: selectedMethod },
    });
  };

  return (
    <div className="order-confirm-container">
      <div className="order-confirm-header">
        <button className="order-confirm-back-btn" onClick={() => navigate(-1)}>
          <BackIcon /> Back
        </button>
        <h1 className="order-confirm-title">Konfirmasi Pesanan</h1>
      </div>

      <div className="order-confirm-section">
        <h2>
          <span className="order-confirm-icon">
            <DollarIcon />
          </span>{" "}
          Pilih Metode Pembayaran
        </h2>
        <div className="order-confirm-payment-methods">
          {paymentMethods.map((method) => (
            <label
              className={`order-confirm-payment-option ${
                selectedMethod === method.value ? "selected" : ""
              }`}
              key={method.value}
            >
              <div className="order-confirm-payment-info">
                <span className="order-confirm-icon">{method.icon}</span>
                <span className="order-confirm-label">{method.label}</span>
              </div>
              <input
                type="radio"
                name="payment"
                value={method.value}
                checked={selectedMethod === method.value}
                onChange={() => setSelectedMethod(method.value)}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="order-confirm-section">
        <h2>
          <span className="order-confirm-icon">
            <PesananIcon />
          </span>{" "}
          Pesanan
        </h2>
        {orders.map((item, idx) => (
          <div className="order-confirm-order-item" key={idx}>
            <span className="order-confirm-item-name">{item.name}</span>
            <span className="order-confirm-item-qty">{item.qty}</span>
            <span className="order-confirm-item-price">
              Rp.{item.qty * item.price}
            </span>
          </div>
        ))}
        <div className="order-confirm-order-total">
          <span>Total</span>
          <span className="order-confirm-item-price">Rp.{total}</span>
        </div>
      </div>

      <button
        className="order-confirm-proceed-btn"
        disabled={!selectedMethod}
        onClick={handleProceed}
      >
        Lanjutkan Pembayaran
      </button>
    </div>
  );
};

export default OrderConfirmationPage;
