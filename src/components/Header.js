"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
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
  children
}) {
  const { language, changeLanguage } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (e) { }

  const isAuth = !!user
  const userType = user?.type // b2c / b2b / admin

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/auth")
  }

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <img src="/images/logo.jpg" alt="Logo" className="logo-img" />
            <span>Excellence Healthcare</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="nav-links">
          <Link to="/">{t("home")}</Link>
          <Link to="/products">{t("products")}</Link>
          <Link to="/contact">{t("contact")}</Link>
          <Link to="/about">À propos</Link>
        </nav>

        {/* Search */}
        <div className="search-bar">
          <input type="text" placeholder={t("search")} />
        </div>

        {/* Right */}
        <div className="header-right">
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="language-select"
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
            <option value="ar">AR</option>
          </select>

          <button className="icon-btn" onClick={onOpenFavorites}>
            <FontAwesomeIcon icon={faHeart} />
            {favoritesCount > 0 && <span className="badge">{favoritesCount}</span>}
          </button>

          <button className="icon-btn" onClick={onOpenNotifications}>
            <FontAwesomeIcon icon={faBell} />
            {notificationsCount > 0 && <span className="badge">{notificationsCount}</span>}
          </button>

          <button
            className="icon-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FontAwesomeIcon icon={faUser} />
          </button>

          <Link to="/cart" className="icon-btn">
            <FontAwesomeIcon icon={faShoppingCart} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        </div>
      </div>

      {children}

      {/* Dropdown */}
      {showDropdown && (
        <div className="profile-dropdown">
          <ul>
            {/* NOT AUTHENTICATED */}
            {!isAuth && (
              <>
                <li>
                  <Link to="/auth">Login / signup</Link>
                </li>
              </>
            )}

            {/* AUTHENTICATED */}
            {isAuth && (
              <>
                {/* B2C */}
                {userType === "b2c" && (
                  <>
                    {/* <li><Link to="/profile">Mon profil</Link></li> */}
                    <li><Link to="/orders">Mes commandes</Link></li>
                    <li><Link to="/favorites">Mes favoris</Link></li>
                  </>
                )}

                {/* B2B */}
                {userType === "b2b" && (
                  <>
                    {user?.approved ? (
                      <>
                        <li><Link to="/b2b/dashboard">Tableau de bord</Link></li>
                        <li><Link to="/b2b/orders">Commandes en gros</Link></li>
                        <li><Link to="/b2b/clients">Gestion des clients</Link></li>
                      </>
                    ) : (
                      <li className="muted">Accès en cours d’activation</li>
                    )}
                  </>
                )}

                {/* ADMIN */}
                {userType === "admin" && (
                  <>
                    <li><Link to="/admin">Back-Office Admin</Link></li>
                    {/* <li><Link to="/admin/settings">Paramètres</Link></li> */}
                  </>
                )}

                {/* LOGOUT */}
                <hr className="dropdown-separator" />
                <li>
                  <button className="logout" onClick={logout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}

    </header>
  )
}
