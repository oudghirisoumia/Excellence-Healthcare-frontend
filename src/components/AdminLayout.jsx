"use client"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Users, Truck, Package, ShoppingCart, Tag, Settings } from "lucide-react"
import "../styles/AdminLayout.css"

export default function AdminLayout({ children }) {
    const { pathname } = useLocation()

    const menu = [
        { label: "Vue d'ensemble", path: "/admin", icon: LayoutDashboard },
        { label: "Utilisateurs", path: "/admin/users", icon: Users },
        { label: "Livraisons", path: "/admin/deliveries", icon: Truck },
    ]

    return (
        <div className="admin-layout">
            <div className="admin-wrapper">
                <header className="admin-header">
                    <h1>Back‑Office Administrateur</h1>
                    <p className="subtitle">Bienvenue Admin - Gestion complète de la plateforme Excellence Parapharmacie</p>
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
                    {children}
                </main>
            </div>
        </div>
    )
}