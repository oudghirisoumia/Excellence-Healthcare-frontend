"use client"
import React, { useEffect, useState } from "react"
import api from "../api"
import "../styles/B2BClients.css"
import { toast } from "react-toastify"

export default function B2BClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    status: "active",
  })
  const [editingId, setEditingId] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const res = await api.get("/b2b/clients")
      setClients(res.data.data || [])
    } catch {
      toast.error("Impossible de charger vos clients")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const payload = editingId ? { ...form, id: editingId } : form
      if (editingId) {
        await api.put(`/b2b/clients/${editingId}`, payload)
        toast.success("Client mis à jour avec succès")
      } else {
        await api.post("/b2b/clients", payload)
        toast.success("Client ajouté avec succès")
      }
      resetForm()
      loadClients()
    } catch {
      toast.error("Une erreur est survenue lors de l’enregistrement")
    }
  }

  const resetForm = () => {
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      status: "active",
    })
    setEditingId(null)
  }

  const handleEdit = client => {
    setForm({
      first_name: client.name?.split(" ")[0] || "",
      last_name: client.name?.split(" ")[1] || "",
      email: client.email,
      phone: client.phone,
      address: client.address,
      city: client.city,
      status: client.status || "active",
    })
    setEditingId(client.id)
  }

  const handleDeleteClick = id => {
    setConfirmDeleteId(id)
  }

  const confirmDelete = async () => {
    try {
      await api.delete(`/b2b/clients/${confirmDeleteId}`)
      toast.success("Client supprimé")
      setConfirmDeleteId(null)
      loadClients()
    } catch {
      toast.error("Impossible de supprimer ce client")
    }
  }

  if (loading) return <div className="loading">Chargement de vos clients…</div>

  return (
    <div className="b2b-clients-page">
      <h1>Mes clients</h1>

      <form className="client-form" onSubmit={handleSubmit}>
        <input
          placeholder="Prénom"
          value={form.first_name}
          onChange={e => setForm({ ...form, first_name: e.target.value })}
          required
        />
        <input
          placeholder="Nom"
          value={form.last_name}
          onChange={e => setForm({ ...form, last_name: e.target.value })}
          required
        />
        <input
          placeholder="Adresse e-mail"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Numéro de téléphone"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          required
        />
        <input
          placeholder="Adresse"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
          required
        />
        <input
          placeholder="Ville"
          value={form.city}
          onChange={e => setForm({ ...form, city: e.target.value })}
          required
        />

        <select
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
        >
          <option value="active">Client actif</option>
          <option value="inactive">Client inactif</option>
          <option value="vip">Client VIP</option>
        </select>

        <button type="submit">
          {editingId ? "Enregistrer les modifications" : "Ajouter un client"}
        </button>
      </form>

      <div className="table-wrap">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th>Ville</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 && (
              <tr>
                <td colSpan="7" className="empty">
                  Aucun client pour le moment
                </td>
              </tr>
            )}

            {clients.map(client => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{client.address}</td>
                <td>{client.city}</td>
                <td>
                  <span className={`status-badge status-${client.status?.toLowerCase()}`}>
                    {client.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(client)} className="edit-btn">
                    Modifier
                  </button>
                  <button
                    className="danger"
                    onClick={() => handleDeleteClick(client.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmDeleteId && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Supprimer ce client ?</h3>
            <p>Cette action est définitive.</p>
            <div className="modal-actions">
              <button onClick={confirmDelete} className="danger">
                Oui, supprimer
              </button>
              <button onClick={() => setConfirmDeleteId(null)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}