// src/pages/CustomerData.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerData.css";
import BackIcon from "../components/icons/BackIcon";

const CustomerData = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nama: "",
    alamat: "",
    kontak: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error on input
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nama.trim()) newErrors.nama = "Nama wajib diisi.";
    if (!form.alamat.trim()) newErrors.alamat = "Alamat wajib diisi.";
    if (!form.kontak.trim()) newErrors.kontak = "Kontak wajib diisi.";
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setStep(2);
  };

  const handleWhatsAppRedirect = () => {
    // 1) Build a multiline message including nama, alamat, kontak
    const message = `
Halo, saya sudah mengisi form dan mengirim bukti bayar:
Nama: ${form.nama}
Alamat: ${form.alamat}
Kontak: ${form.kontak}
    `.trim();

    // 2) URL-encode the message
    const encoded = encodeURIComponent(message);

    // 3) Construct WhatsApp URL (replace phone number as needed)
    const whatsappUrl = `https://wa.me/62895360097158?text=${encoded}`;

    // 4) Redirect
    window.location.href = whatsappUrl;
  };

  return (
    <div className="customer-data">
      <button className="customer-data__back" onClick={() => navigate(-1)}>
        <BackIcon /> Back
      </button>

      <h2 className="customer-data__title">DATA DIRI</h2>

      {step === 1 ? (
        <div className="customer-data__form">
          <label>
            Nama
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
            />
            {errors.nama && <span className="error-text">{errors.nama}</span>}
          </label>
          <label>
            Alamat
            <input
              type="text"
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
            />
            {errors.alamat && (
              <span className="error-text">{errors.alamat}</span>
            )}
          </label>
          <label>
            Kontak
            <input
              type="text"
              name="kontak"
              value={form.kontak}
              onChange={handleChange}
            />
            {errors.kontak && (
              <span className="error-text">{errors.kontak}</span>
            )}
          </label>
          <button className="customer-data__submit" onClick={handleSubmit}>
            KIRIM BUKTI BAYAR
          </button>
        </div>
      ) : (
        <div className="customer-data__redirect">
          <p className="customer-data__redirect-text">
            ANDA AKAN DIALIHKAN KE <br /> WHATSAPP
          </p>
          <button
            className="customer-data__confirm"
            onClick={handleWhatsAppRedirect}
          >
            KONFIRMASI
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerData;
