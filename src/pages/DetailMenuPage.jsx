import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./DetailMenuPage.css";
import { IoArrowBack } from "react-icons/io5";
import { BiArrowBack } from "react-icons/bi";
import BackIcon from "../components/icons/BackIcon";

export default function DetailMenuPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;

  if (!item) {
    return <p>Menu item not found</p>;
  }

  return (
    <>
      <div className="menu-detail-page">
        <div className="menu-detail-image-wrapper">
          <img className="menu-detail-image" src={item.image} alt={item.name} />
          <button className="menu-detail-back" onClick={() => navigate(-1)}>
            <BackIcon /> Back
          </button>
        </div>

        <div className="menu-detail-info">
          <h1 className="menu-detail-title">{item.name}</h1>
          <p className="menu-detail-description">
            {item.description || "Default description"}
          </p>
          <div className="menu-detail-price-container">
            <p className="menu-detail-price">{`Rp. ${item.price}` || "Rp."}</p>
            <button
              className="menu-detail-add-btn"
              onClick={() => navigate("/add-menu", { state: { item } })}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
