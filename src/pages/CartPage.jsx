// src/pages/CartPage.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";
import logo from "../assets/lunchbylaa_logo.png";
import { FaShoppingBasket } from "react-icons/fa";
import MenuSection from "../components/MenuSection";

// ← Replace <YOUR_TAB_NAME> with the name of your sheet’s tab (e.g. "Sheet1")
const GOOGLE_SHEETS_ENDPOINT =
  "https://v1.nocodeapi.com/arsy/google_sheets/YyUxVYajMvWhKiuY?tabId=Sheet1";

export const CartPage = () => {
  const navigate = useNavigate();

  // 1) Load cart from localStorage on mount
  const [items, setItems] = useState([]);
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        const normalized = parsed.map((item) => ({
          ...item,
          quantity:
            typeof item.quantity === "number" && item.quantity >= 1
              ? item.quantity
              : 1,
        }));
        setItems(normalized);
      } catch (e) {
        console.error("Failed to parse cartItems:", e);
      }
    }
  }, []);

  // 2) Load menuData for “You might also like…”
  const [menuData, setMenuData] = useState([]);
  useEffect(() => {
    const stored = localStorage.getItem("menuData");
    if (stored) {
      try {
        setMenuData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse menuData:", e);
        fetchAndInitialize();
      }
    } else {
      fetchAndInitialize();
    }

    function fetchAndInitialize() {
      fetch("/menuData.json")
        .then((res) => {
          if (!res.ok) throw new Error("Could not fetch menuData.json");
          return res.json();
        })
        .then((jsonData) => {
          setMenuData(jsonData);
          localStorage.setItem("menuData", JSON.stringify(jsonData));
        })
        .catch((err) => {
          console.error("Error fetching menuData.json:", err);
        });
    }
  }, []);

  // 3) Change quantity → update both state and localStorage
  const handleQuantityChange = (index, delta) => {
    setItems((prevItems) => {
      const updated = prevItems.map((item, idx) => {
        if (idx !== index) return item;
        const currentQty = Number(item.quantity) || 0;
        const newQty = Math.max(1, currentQty + delta);
        return { ...item, quantity: newQty };
      });
      localStorage.setItem("cartItems", JSON.stringify(updated));
      return updated;
    });
  };

  // 4) Compute total
  const total = items.reduce((sum, item) => {
    const numericPrice =
      parseInt(item.price?.toString().replace(/[^\d]/g, ""), 10) || 0;
    return sum + numericPrice * item.quantity;
  }, 0);

  // 5) handleCheckout → build a 2D array and POST to NoCodeAPI
  const handleCheckout = () => {
    if (items.length === 0) {
      alert("Keranjang kosong—tidak ada yang disimpan.");
      return;
    }

    const now = new Date();
    const timestamp = now.toISOString(); // e.g. "2025-06-09T12:34:56.789Z"

    // Build an array of rows, each row is an array of columns
    // You can adjust the column order here to match your sheet’s headers
    const rows = items.map((item) => {
      const numericPrice =
        parseInt(item.price?.toString().replace(/[^\d]/g, ""), 10) || 0;
      const subtotal = numericPrice * item.quantity;

      return [
        timestamp,
        item.name,
        item.level || "",
        item.price,
        item.quantity.toString(),
        subtotal.toString(),
        total.toString(),
      ];
      // This produces columns: [Timestamp, Name, Level, Price, Quantity, Subtotal, TotalOrderValue]
    });

    const requestOptions = {
      method: "post",
      headers: new Headers({ "Content-Type": "application/json" }),
      redirect: "follow",
      body: JSON.stringify(rows),
    };

    fetch(GOOGLE_SHEETS_ENDPOINT, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.text();
      })
      .then((result) => {
        console.log("Sheet update result:", result);

        // 6) Clear cart from localStorage & React state
        localStorage.removeItem("cartItems");
        setItems([]);

        // 7) Navigate to confirmation
        navigate("/confirmation");
      })
      .catch((error) => {
        console.error("Error writing to Google Sheets:", error);
        alert(
          "Terjadi kesalahan saat menyimpan pesanan. Silakan coba lagi.\n" +
            error.message
        );
      });
  };

  return (
    <div className="cart-page">
      <header className="header-cart">
        <div className="header-top">
          <img src={logo} alt="main-logo" className="logo" />
          <div className="icons">
            <span role="img" aria-label="cart">
              🛒
            </span>
          </div>
        </div>
      </header>

      <main className="cart-content">
        <div className="cart-list">
          {items.map((item, idx) => (
            <div className="cart-item" key={idx}>
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <h2>{item.name}</h2>
                {item.level && <p>Level: {item.level.toUpperCase()}</p>}
                <p>Harga: Rp. {item.price}</p>

                <div className="cart-qty-controls">
                  <button onClick={() => handleQuantityChange(idx, -1)}>
                    –
                  </button>
                  <span className="cart-item-qty">{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(idx, +1)}>
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-bar">
          <FaShoppingBasket className="cart-bar-icon" />
          <span className="cart-bar-total">Rp. {total.toLocaleString()}</span>
          <button className="cart-bar-checkout" onClick={handleCheckout}>
            CHECKOUT
          </button>
        </div>
      </main>

      <div style={{ margin: "16px" }}>
        <MenuSection data={menuData} />
      </div>
    </div>
  );
};
