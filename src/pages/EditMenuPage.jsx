// src/pages/EditMenuPage.jsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./EditMenuPage.css";

export default function EditMenuPage() {
  const location = useLocation();
  const navigate = useNavigate();
  // Destructure the item and its indices from React Router state
  const { item, sectionIndex, itemIndex } = location.state || {};

  const [name, setName] = useState(item?.name || "");
  const [price, setPrice] = useState(item?.price || "");
  // image can be either a remote URL or a Base64 string
  const [image, setImage] = useState(item?.image || "");
  // We'll keep track of the file object if user selects a new one
  const [fileObject, setFileObject] = useState(null);

  useEffect(() => {
    // If somehow there's no item passed in state, navigate back to /admin
    if (!item) {
      navigate("/admin");
    }
  }, [item, navigate]);

  // Called when user picks a new file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Preview immediately by converting to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); // reader.result is a Base64 data URL
    };
    reader.readAsDataURL(file);
    setFileObject(file);
  };

  const handleSave = () => {
    // 1) Read existing menuData from localStorage
    const storedDataJSON = localStorage.getItem("menuData");
    if (!storedDataJSON) {
      console.error("No menuData found in localStorage!");
      return;
    }

    let storedData;
    try {
      storedData = JSON.parse(storedDataJSON);
    } catch (e) {
      console.error("Could not parse menuData from localStorage:", e);
      return;
    }

    // 2) Create a new copy of the data, updating the specific item
    const updatedData = [...storedData];
    updatedData[sectionIndex].items[itemIndex] = {
      ...item,
      name,
      price,
      image, // This is either the old URL or the new Base64 string
    };

    // 3) Write back to localStorage
    localStorage.setItem("menuData", JSON.stringify(updatedData));

    // 4) Go back to admin dashboard
    navigate("/admin");
  };

  return (
    <div className="edit-container">
      <h2 className="edit-title">Edit Menu</h2>

      <div className="edit-form-group">
        <label className="edit-label">Nama</label>
        <input
          className="edit-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Contoh: Ricebowl"
        />
      </div>

      <div className="edit-form-group">
        <label className="edit-label">Harga</label>
        <input
          className="edit-input"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="text"
          placeholder="Contoh: 25000"
        />
      </div>

      <div className="edit-form-group">
        <label className="edit-label">Gambar (Upload File)</label>
        <input
          className="edit-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <div className="edit-preview">
        <p className="edit-preview-label">Preview Gambar:</p>
        {image ? (
          <img
            src={image}
            alt={name}
            className="edit-preview-img"
            style={{ maxWidth: "200px", maxHeight: "200px" }}
          />
        ) : (
          <p>Tidak ada gambar.</p>
        )}
      </div>

      <div className="edit-button-group">
        <button className="edit-save-btn" onClick={handleSave}>
          💾 Simpan Perubahan
        </button>
        <button className="edit-cancel-btn" onClick={() => navigate(-1)}>
          ❌ Batal
        </button>
      </div>
    </div>
  );
}
