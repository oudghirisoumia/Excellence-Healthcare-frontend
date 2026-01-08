"use client"
import { Link, Outlet, useLocation } from "react-router-dom"
import { LayoutDashboard, ActivityIcon, Users, Truck, Package, ClipboardList } from "lucide-react"
import "../styles/AdminLayout.css"

export default function AdminLayout() {
  const { pathname } = useLocation()

  const menu = [
    { label: "Vue d'ensemble", path: "/admin", icon: LayoutDashboard },
    { label: "Monitoring", path: "/admin/monitoring", icon: ActivityIcon },
    { label: "Utilisateurs", path: "/admin/users", icon: Users },
    { label: "Produits", path: "/admin/products", icon: Package },
    { label: "Commandes", path: "/admin/orders", icon: ClipboardList },
    // { label: "Livraisons", path: "/admin/deliveries", icon: Truck }
  ]

  return (
    <div className="admin-layout">
      <div className="admin-wrapper">
        <header className="admin-header">
          <h1>Back‑Office Administrateur</h1>
          <p className="subtitle">
            Bienvenue Admin - Gestion complète de la plateforme Excellence Healthcare
          </p>
        </header>

        <nav className="admin-nav">
          {menu.map(item => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={pathname === item.path ? "active" : ""}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
