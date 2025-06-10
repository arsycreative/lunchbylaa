// src/components/MenuSection.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

export default function MenuSection({ data }) {
  const navigate = useNavigate();

  return (
    <>
      {data.map((section, sectionIndex) => (
        <div key={sectionIndex} className="section">
          <h2>{section.category}</h2>
          <div className="grid">
            {section.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="card"
                onClick={() =>
                  navigate("/detail", {
                    state: { item },
                  })
                }
              >
                <img src={item.image} alt={item.name} className="card-image" />
                <div className="card-info">
                  <p className="card-name">{item.name}</p>
                  <p className="card-price">Rp. {item.price}</p>
                </div>
                <button className="add-btn">+</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
