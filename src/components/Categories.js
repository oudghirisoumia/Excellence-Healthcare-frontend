import React from "react";
import "../styles/Categories.css";

const cats = [
  "Tous les produits",
  "Soins du visage",
  "Soins du corps",
  "Cheveux",
  "Vitamines & Compléments",
  "Hygiène",
  "Maquillage",
  "Bébé & Maman",
  "Solaire",
];

export default function Categories() {
  return (
    <div className="categories-sticky-wrapper">
      <div className="categories-section">
        <div className="categories-container">
          {cats.map((c, index) => (
            <div key={index} className="category-card">
              {c}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
