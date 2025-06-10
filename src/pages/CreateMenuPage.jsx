import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateMenuPage.css";
import profilePic from "../assets/profile.png";
import logo from "../assets/lunchbylaa_logo.png";

export default function CreateMenuPage() {
  const navigate = useNavigate();

  // form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Snack");

  // Holds the Base64 data URL once a file is chosen
  const [image, setImage] = useState("");
  const [fileObject, setFileObject] = useState(null);

  // Track errors: one key per field
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    image: "",
  });

  // When the user selects a file, convert it to Base64 for preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImage("");
      setFileObject(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); // Base64 data URL
    };
    reader.readAsDataURL(file);
    setFileObject(file);

    // Clear any existing error on image
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  // Validate all fields; return true if valid
  const validateAll = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Nama wajib diisi.";
    if (!price.trim()) newErrors.price = "Harga wajib diisi.";
    if (!image) newErrors.image = "Gambar wajib diunggah.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    // 1) Validate before saving
    if (!validateAll()) {
      return;
    }

    // 2) Build the new item object
    const newItem = {
      name: name.trim(),
      price: price.trim(),
      image: image, // Base64 data URL
      description: "",
    };

    // 3) Read existing menuData from localStorage
    let storedData = [];
    try {
      const raw = localStorage.getItem("menuData");
      storedData = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(storedData)) {
        storedData = [];
      }
    } catch (err) {
      console.error("Failed to parse menuData from localStorage:", err);
      storedData = [];
    }

    // 4) Find or create the section
    const sectionIndex = storedData.findIndex(
      (sec) => sec.category === category
    );
    if (sectionIndex !== -1) {
      storedData[sectionIndex].items.push(newItem);
    } else {
      const newSection = {
        category: category,
        items: [newItem],
      };
      storedData.push(newSection);
    }

    // 5) Write updated array back to localStorage
    try {
      localStorage.setItem("menuData", JSON.stringify(storedData));
    } catch (err) {
      console.error("Failed to write updated menuData to localStorage:", err);
    }

    // 6) Navigate back to admin
    navigate("/admin");
  };

  // Determine if SAVE button should be disabled
  const isSaveDisabled = !name.trim() || !price.trim() || !image;

  return (
    <div className="create-menu-container">
      <header className="create-menu-header">
        <img src={logo} alt="main-logo" />
        <img
          src={profilePic}
          alt="Admin Avatar"
          className="admin-main-dashboard__avatar"
        />
      </header>

      {/* Preview box (fixed 300×200 px; grey when no image; shows <img> if image exists) */}
      <div className="create-menu-image-preview">
        {image ? (
          <img src={image} alt="Food Preview" className="preview-img" />
        ) : null}
      </div>
      {errors.image && <p className="error-text">* {errors.image}</p>}

      <div className="create-menu-form">
        <input
          className="create-menu-input create-menu-name"
          placeholder="Nama Menu"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: "" }));
          }}
          type="text"
        />
        {errors.name && <p className="error-text">* {errors.name}</p>}

        <input
          className="create-menu-input create-menu-price"
          placeholder="Harga (contoh: 25000)"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            setErrors((prev) => ({ ...prev, price: "" }));
          }}
          type="text"
        />
        {errors.price && <p className="error-text">* {errors.price}</p>}

        <select
          className="create-menu-dropdown"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Snack">Snack</option>
          <option value="Drink">Drink</option>
          <option value="Lunch">Lunch</option>
          <option value="Dessert">Dessert</option>
        </select>

        {/* IMAGE UPLOAD */}
        <input
          className="create-menu-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        <button
          className="create-menu-save-btn"
          onClick={handleSave}
          disabled={isSaveDisabled}
          style={{
            opacity: isSaveDisabled ? 0.5 : 1,
            cursor: isSaveDisabled ? "not-allowed" : "pointer",
          }}
        >
          💾 SAVE
        </button>
      </div>
    </div>
  );
}
