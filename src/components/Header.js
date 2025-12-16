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
<<<<<<< HEAD
  children   //categories
=======
  children
>>>>>>> main
}) {
  const { language, changeLanguage } = useLanguage()
  const t = (key) => getTranslation(language, key)
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)

  let user = null
  try {
<<<<<<< HEAD
    user = JSON.parse(localStorage.getItem("user") || "null")
  } catch (e) { }
  const userType = user?.type || "b2c"
=======
    user = JSON.parse(localStorage.getItem("user"))
  } catch (e) { }

  const isAuth = !!user
  const userType = user?.type // b2c / b2b / admin

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/auth")
  }
>>>>>>> main

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <img src="/images/logo.jpg" alt="Logo" className="logo-img" />
<<<<<<< HEAD
            <span> Excellence Healthcare</span>
=======
            <span>Excellence Healthcare</span>
>>>>>>> main
          </Link>
        </div>

        {/* Navigation */}
        <nav className="nav-links">
          <Link to="/">{t("home")}</Link>
          <Link to="/products">{t("products")}</Link>
          <Link to="/contact">{t("contact")}</Link>
        </nav>

<<<<<<< HEAD
        {/* Search bar */}
=======
        {/* Search */}
>>>>>>> main
        <div className="search-bar">
          <input type="text" placeholder={t("search")} />
        </div>

<<<<<<< HEAD
        {/* Right side */}
=======
        {/* Right */}
>>>>>>> main
        <div className="header-right">
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="language-select"
<<<<<<< HEAD
            title={t("language")}
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>

          <button className="icon-btn" onClick={onOpenFavorites} title={t("favorites")}>
=======
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
            <option value="ar">AR</option>
          </select>

          <button className="icon-btn" onClick={onOpenFavorites}>
>>>>>>> main
            <FontAwesomeIcon icon={faHeart} />
            {favoritesCount > 0 && <span className="badge">{favoritesCount}</span>}
          </button>

<<<<<<< HEAD
          <button className="icon-btn" onClick={onOpenNotifications} title={t("notifications")}>
=======
          <button className="icon-btn" onClick={onOpenNotifications}>
>>>>>>> main
            <FontAwesomeIcon icon={faBell} />
            {notificationsCount > 0 && <span className="badge">{notificationsCount}</span>}
          </button>

          <button
            className="icon-btn"
            onClick={() => setShowDropdown(!showDropdown)}
<<<<<<< HEAD
            title={t("auth")}
=======
>>>>>>> main
          >
            <FontAwesomeIcon icon={faUser} />
          </button>

<<<<<<< HEAD
          <Link to="/cart" className="icon-btn" title={t("cart")}>
=======
          <Link to="/cart" className="icon-btn">
>>>>>>> main
            <FontAwesomeIcon icon={faShoppingCart} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        </div>
      </div>

<<<<<<< HEAD
      {/* categories */}
      {children}

      {/* Dropdown menu */}
      {showDropdown && (
        <div className="profile-dropdown">
          <ul>
            {userType === "b2c" && (
              <>
                <li><Link to="/profile">Mon profil</Link></li>
                <li><Link to="/orders">Mes commandes</Link></li>
                <li><Link to="/favorites">Mes favoris</Link></li>
              </>
            )}

            {userType === "b2b" && (
              <>
                <li><Link to="/b2b/profile">Mon profil</Link></li>
                <li><Link to="/b2b/dashboard">Dashboard</Link></li>
                <li><Link to="/b2b/orders">Commandes en gros</Link></li>
                <li><Link to="/b2b/clients">Gestion des clients</Link></li>
              </>
            )}
            <hr class="dropdown-separator"></hr>
            <li>
              <button className="logout"
                onClick={() => {
                  localStorage.removeItem("token")
                  localStorage.removeItem("user")
                  navigate("/auth")
                }}
              >
                Déconnexion
              </button>
            </li>
          </ul>
        </div>
      )}
=======
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
                    {/* <li><Link to="/b2b/profile">Mon profil</Link></li> */}
                    <li><Link to="/b2b/dashboard">Tableau de bord</Link></li>
                    <li><Link to="/b2b/orders">Commandes en gros</Link></li>
                    <li><Link to="/b2b/clients">Gestion des clients</Link></li>
                    {/* <li><Link to="/b2b/settings">Paramètres</Link></li> */}
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

>>>>>>> main
    </header>
  )
}
