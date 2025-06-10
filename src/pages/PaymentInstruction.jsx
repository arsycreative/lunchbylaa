import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentInstruction.css";
import BackIcon from "../components/icons/BackIcon";
import { ImQrcode } from "react-icons/im";

const PaymentInstruction = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { orders, total, method } = state || {};

  let content;
  if (method === "TRANSFER") {
    content = (
      <>
        <h2 className="order-confirm-payment__method">TRANSFER - Bank BCA</h2>
        <p>Account No.: 342545234235</p>
        <p>a.n Lunhbylaa</p>
      </>
    );
  } else if (method === "TUNAI") {
    content = (
      <>
        <h2 className="order-confirm-payment__method">TUNAI</h2>
        <p>Pembayaran dilakukan setelah menerima produk</p>
      </>
    );
  } else {
    // e-wallet methods
    content = (
      <>
        <h2 className="order-confirm-payment__method">{method}</h2>
        <div className="order-confirm-payment__qr">
          <ImQrcode className="order-confirm-payment__qr-img" />
        </div>
        <p className="order-confirm-payment__account">a.n Lunhbylaa</p>
        <p className="order-confirm-payment__number">
          No. {method} : 0821-xxxx-xxxx
        </p>
      </>
    );
  }

  return (
    <div className="order-confirm-payment">
      <button
        className="order-confirm-payment__back-btn"
        onClick={() => navigate(-1)}
      >
        <BackIcon /> Back
      </button>

      <div className="order-confirm-payment__content">
        {method != "TUNAI" && (
          <p className="order-confirm-payment__instruction">
            Tolong screenshot bukti pembayaran!!
            <br />& Kirimkan melalui Whatsapp
          </p>
        )}
        {content}
      </div>

      <div className="order-confirm-payment__total-bar">
        <span>Total</span>
        <span className="order-confirm-payment__total-value">Rp.{total}</span>
      </div>

      <button
        className="order-confirm-payment__cta"
        onClick={() => navigate("/customer-data")}
      >
        ISI FORM DATA DIRI
      </button>
    </div>
  );
};

export default PaymentInstruction;
