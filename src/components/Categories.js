import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Categories.css";

const cats = [
  { id: null, name: "Tous les produits" },
  { id: 1, name: "Soins du visage" },
  { id: 2, name: "Soins du Cheveux" },
  { id: 3, name: "Soins du corps" },
  { id: 4, name: "Bébé & Maman" },
  { id: 5, name: "Bucco Dentaire" },
  { id: 6, name: "Solaire" },
  { id: 7, name: "Bien Etre" },
  { id: 8, name: "Maquillage" },
];

export default function Categories() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId, categoryName) => {
    if (categoryId === null) {
      navigate("/products");
    } else {
      navigate(`/products?category=${categoryId}`);
    }
  };

  return (
    <div className="categories-sticky-wrapper">
      <div className="categories-section">
        <div className="categories-container">
          {cats.map((c, index) => (
            <div
              key={index}
              className="category-card"
              onClick={() => handleCategoryClick(c.id, c.name)}
              style={{ cursor: "pointer" }}
            >
              {c.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
