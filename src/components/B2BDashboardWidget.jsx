import React from "react";
import "../styles/B2BDashboardWidget.css";

const orders = [
  { id: "ORD001", client: "Clinique ABC", total: "$1200", status: "En cours", date: "2025-12-22" },
  { id: "ORD002", client: "Pharmacie XYZ", total: "$750", status: "Livrée", date: "2025-12-20" },
  { id: "ORD003", client: "Hôpital LMN", total: "$980", status: "Annulée", date: "2025-12-21" },
];

const B2BDashboardWidget = () => {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Excellence Healthcare</h2>
        <ul>
          <li className="active">Dashboard</li>
          <li>Commandes B2B</li>
          <li>Clients Pro</li>
          <li>Produits</li>
          <li>Facturation</li>
          <li>Paramètres</li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>Dashboard B2B Admin</h1>
          <div className="profile">
            <span>Rajae</span>
            <img src="https://i.pravatar.cc/40" alt="admin" />
          </div>
        </header>

        <section className="stats-cards">
          <div className="card">
            <h3>Total Commandes</h3>
            <p>58</p>
          </div>
          <div className="card">
            <h3>Commandes Livrées</h3>
            <p>42</p>
          </div>
          <div className="card">
            <h3>Chiffre d’Affaires</h3>
            <p>$12,450</p>
          </div>
          <div className="card">
            <h3>Clients Pro</h3>
            <p>23</p>
          </div>
        </section>

        <section className="orders-table">
          <h2>Dernières Commandes B2B</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.client}</td>
                  <td>{order.total}</td>
                  <td className={`status ${order.status.toLowerCase().replace(" ", "-")}`}>{order.status}</td>
                  <td>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default B2BDashboardWidget;
