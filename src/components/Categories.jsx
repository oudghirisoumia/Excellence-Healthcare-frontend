import React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "../styles/Categories.css"

const categories = [
  { id: "all", name: "Tous les produits" },
  { id: "soins-visage", name: "Soins du visage"},
  { id: "soins-corps", name: "Soins du corps" },
  { id: "cheveux", name: "Cheveux", icon: "Waves" },
  { id: "vitamines", name: "Vitamines & Compléments"},
  { id: "hygiene", name: "Hygiène"},
  { id: "maquillage", name: "Maquillage" },
  { id: "bebe-maman", name: "Bébé & Maman", },
  { id: "solaire", name: "Solaire" },
]

export default function Categories() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Récupère la catégorie active depuis l'URL
  const currentCategory = location.pathname === "/" 
    ? "all" 
    : location.pathname.split("/category/")[1] || "all"

  const handleCategoryClick = (categoryId) => {
    if (categoryId === "all") {
      navigate("/")
    } else {
      navigate(`/category/${categoryId}`)
    }
  }

  return (
    <div className="categories-sticky-wrapper">
      <div className="categories-section">
        <div className="categories-container">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`category-card ${currentCategory === cat.id ? "active" : ""}`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
              {currentCategory === cat.id && (
                <div className="active-indicator"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}