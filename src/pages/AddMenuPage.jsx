// src/pages/AddMenuPage.jsx

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AddMenuPage.css";
import { IoChevronBack } from "react-icons/io5";

export default function AddMenuPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state?.item;

  const [quantity, setQuantity] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState("");

  const levels = [
    { id: "comedy", label: "COMEDY (LEVEL 1)" },
    { id: "adventure", label: "ADVENTURE (LEVEL 2)" },
    { id: "drama", label: "DRAMA (LEVEL 3)" },
    { id: "horror", label: "HOROR (LEVEL 4)" },
  ];

  if (!item) return <p>Menu item not found</p>;

  const handleCheckbox = (levelId) => {
    setSelectedLevel(levelId);
  };

  const handleAddToCart = () => {
    const cartItem = { ...item, quantity, level: selectedLevel };

    // 1) Read the existing cart from localStorage (or empty array)
    const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];

    // 2) Append the new cartItem
    const updatedCart = [...existingCart, cartItem];

    // 3) Write back to localStorage
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    // 4) Navigate to the CartPage (no need to pass state)
    navigate("/cart");
  };

  return (
    <div className="add-menu-page">
      <div className="add-menu-header">
        <button className="add-menu-back-button" onClick={() => navigate(-1)}>
          <IoChevronBack /> Back
        </button>
        <h4 className="add-menu-title">Tambahkan Menu</h4>
      </div>

      <div className="add-menu-section">
        <div className="add-menu-card">
          <img src={item.image} alt={item.name} className="add-menu-image" />

          <div className="add-menu-info">
            <div className="add-menu-content">
              <h2 className="add-menu-name">{item.name}</h2>
              <div className="add-menu-price-and-qty">
                <p className="add-menu-price">{`Rp. ${item.price}` || "Rp."}</p>
                <div className="add-menu-quantity-selector">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    −
                  </button>
                  <span className="add-menu-quantity-value">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>＋</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="add-menu-hot-level-container">
          <p className="add-menu-hot-level-title">HOT STORY LEVEL (PILIH 1)</p>
          {levels.map((level) => (
            <label key={level.id} className="add-menu-checkbox-label">
              <span>{level.label}</span>
              <input
                type="checkbox"
                checked={selectedLevel === level.id}
                onChange={() => handleCheckbox(level.id)}
              />
            </label>
          ))}
        </div>

        <button
          className="add-menu-add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={!selectedLevel}
        >
          MASUKAN KE KERANJANG
        </button>
      </div>
    </div>
  );
}
