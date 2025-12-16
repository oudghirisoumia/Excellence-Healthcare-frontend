"use client"
import React, { useEffect, useState } from "react"
import api from "../api"
import "../styles/B2BClients.css"
<<<<<<< HEAD
=======
import { toast } from "react-toastify"
>>>>>>> main

const B2BClients = () => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", status: "active" })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const res = await api.get("/b2b/clients")
      setClients(res.data.data)
    } catch (err) {
      console.error("Error loading clients:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const payload = editingId ? { ...form, id: editingId } : form
      await api.post("/b2b/clients", payload)
<<<<<<< HEAD
=======
      toast.success(editingId ? "Client mis à jour" : "Client ajouté")
>>>>>>> main
      setForm({ name: "", email: "", phone: "", address: "", city: "", status: "active" })
      setEditingId(null)
      loadClients()
    } catch (err) {
<<<<<<< HEAD
=======
      toast.error("Erreur lors de l’enregistrement du client")
>>>>>>> main
      console.error("Error saving client:", err)
    }
  }

  const handleEdit = client => {
    setForm({ ...client })
    setEditingId(client.id)
  }

  const handleDelete = async id => {
    if (!window.confirm("Supprimer ce client ?")) return
    try {
      await api.delete(`/b2b/clients/${id}`)
<<<<<<< HEAD
      loadClients()
    } catch (err) {
=======
      toast.success("Client supprimé")
      loadClients()
    } catch (err) {
      toast.error("Erreur lors de la suppression du client")
>>>>>>> main
      console.error("Error deleting client:", err)
    }
  }

  if (loading) return <div className="loading">Chargement...</div>

  return (
    <div className="b2b-clients-page">
      <h1>Gestion des clients</h1>

      {/* Form : add/update */}
      <form className="client-form" onSubmit={handleSubmit}>
        <input placeholder="Nom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input placeholder="Téléphone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
        <input placeholder="Adresse" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
        <input placeholder="Ville" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required />
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
          <option value="vip">VIP</option>
        </select>
        <button type="submit">{editingId ? "Mettre à jour" : "Ajouter"}</button>
      </form>

      {/* Clients */}
      <div className="table-wrap">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th>Ville</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 && (
              <tr>
                <td colSpan="7" className="empty">Aucun client trouvé</td>
              </tr>
            )}
            {clients.map(client => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{client.address}</td>
                <td>{client.city}</td>
                <td><span className={`status-badge status-${client.status}`}>{client.status}</span></td>
                <td>
                  <button onClick={() => handleEdit(client)} className="edit-btn">Éditer</button>
                  <button className="danger" onClick={() => handleDelete(client.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default B2BClients
