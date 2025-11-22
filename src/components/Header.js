"use client"

import { Link } from "react-router-dom"
import { useLanguage } from "../context/LanguageContext"
import { getTranslation } from "../translations/translations"
import "../styles/Header.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart, faBell, faUser, faShoppingCart } from "@fortawesome/free-solid-svg-icons"
import { library } from "@fortawesome/fontawesome-svg-core"

library.add(faHeart, faBell, faUser, faShoppingCart)

export default function Header({
  cartCount = 0,
  favoritesCount = 0,
  notificationsCount = 0,
  onOpenFavorites,
  onOpenNotifications,
}) {
  const { language, changeLanguage } = useLanguage()
  const t = (key) => getTranslation(language, key)

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <img src="/images/logo.jpg" alt="Logo" className="logo-img" />
            <span> Excellence Healthcare</span>  
          </Link>
        </div>

        {/* Navigation */}
        <nav className="nav-links">
          <Link to="/">{t("home")}</Link>
          <Link to="/products">{t("products")}</Link>
          <Link to="/contact">{t("contact")}</Link>
        </nav>

        {/* Barre de recherche */}
        <div className="search-bar">
          <input type="text" placeholder={t("search")} />
        </div>

        {/* Langue et icônes */}
        <div className="header-right">
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="language-select"
            title={t("language")}
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>

          <button className="icon-btn" onClick={onOpenFavorites} title={t("favorites")}>
            <FontAwesomeIcon icon={faHeart} />
            {favoritesCount > 0 && <span className="badge">{favoritesCount}</span>}
          </button>

          <button className="icon-btn" onClick={onOpenNotifications} title={t("notifications")}>
            <FontAwesomeIcon icon={faBell} />
            {notificationsCount > 0 && <span className="badge">{notificationsCount}</span>}
          </button>

          <Link to="/auth" className="icon-btn" title={t("auth")}>
            <FontAwesomeIcon icon={faUser} />
          </Link>

          <Link to="/cart" className="icon-btn" title={t("cart")}>
            <FontAwesomeIcon icon={faShoppingCart} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  )
}
