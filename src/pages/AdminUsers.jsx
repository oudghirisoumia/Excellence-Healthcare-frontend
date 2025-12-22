import { useEffect, useState } from "react"
import api from "../api"
import "../styles/AdminUsers.css"
import { FaEdit, FaTrash, FaPlus, FaCheck } from "react-icons/fa"
import { toast } from "react-toastify"

const AdminUsers = () => {
    const [users, setUsers] = useState([])
    const [filter, setFilter] = useState("all")
    const [loading, setLoading] = useState(true)

    const [showModal, setShowModal] = useState(false)
    const [editingUser, setEditingUser] = useState(null)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [userToDelete, setUserToDelete] = useState(null)

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        type: "b2c",
        phone: "",
        address: "",
        city: "",
        company_name: "",
        tax_id: "",
        license_number: "",
    })

    // FETCH USERS
    const fetchUsers = async () => {
        try {
            const res = await api.get("/admin/users")
            setUsers(res.data.data || res.data)
        } catch (err) {
            toast.error("Erreur lors du chargement des utilisateurs")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    // STATS
    const totalUsers = users.length
    const b2cCount = users.filter(u => u.type === "b2c").length
    const b2bCount = users.filter(u => u.type === "b2b").length

    // FILTER
    const filteredUsers = users.filter(user => {
        if (filter === "all") return user.type !== "admin"
        return user.type === filter
    })

    // Open ADD Modal
    const openAddModal = () => {
        setEditingUser(null)
        setForm({
            name: "",
            email: "",
            password: "",
            type: "b2c",
            phone: "",
            address: "",
            city: "",
            company_name: "",
            tax_id: "",
            license_number: "",
        })
        setShowModal(true)
    }

    // Open EDIT Modal
    const openEditModal = (user) => {
        setEditingUser(user)
        setForm({ ...user, password: "" })
        setShowModal(true)
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = { ...form }
        if (payload.type === "b2c") {
            payload.company_name = null
            payload.tax_id = null
            payload.license_number = null
        }

        try {
            if (editingUser) {
                await api.put(`/admin/users/${editingUser.id}`, payload)
                toast.success("Utilisateur mis à jour")
            } else {
                await api.post("/admin/users", payload)
                toast.success("Utilisateur créé")
            }
            setShowModal(false)
            fetchUsers()
        } catch (err) {
            toast.error("Erreur lors de l'enregistrement")
        }
    }

    // Open DELETE Confirmation Modal
    const confirmDelete = (user) => {
        setUserToDelete(user)
        setShowDeleteModal(true)
    }

    // Delete User
    const handleDelete = async () => {
        try {
            await api.delete(`/admin/users/${userToDelete.id}`)
            toast.success("Utilisateur supprimé")
            fetchUsers()
        } catch {
            toast.error("Suppression impossible")
        } finally {
            setShowDeleteModal(false)
            setUserToDelete(null)
        }
    }
    // Approve B2B User
    const handleApprove = async (userId) => {
        try {
            await api.post(`/admin/users/${userId}/approve`)
            toast.success("Utilisateur B2B validé avec succès")
            fetchUsers()
        } catch {
            toast.error("Erreur lors de la validation")
        }
    }

    if (loading) return <p>Chargement...</p>

    return (
        <div className="admin-users">
            <h1>Gestion des utilisateurs</h1>

            {/* STATS */}
            <div className="stats">
                <div className="stat-card">Total<br /><strong>{totalUsers}</strong></div>
                <div className="stat-card">B2C<br /><strong>{b2cCount}</strong></div>
                <div className="stat-card">B2B<br /><strong>{b2bCount}</strong></div>
            </div>

            {/* FILTER & ADD */}
            <div className="table-header">
                <div className="filters">
                    <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>Tous</button>
                    <button onClick={() => setFilter("b2c")} className={filter === "b2c" ? "active" : ""}>B2C</button>
                    <button onClick={() => setFilter("b2b")} className={filter === "b2b" ? "active" : ""}>B2B</button>
                </div>

                <button className="add-btn" onClick={openAddModal}>
                    <FaPlus /> Ajouter utilisateur
                </button>
            </div>

            {/* TABLE */}
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Téléphone</th>
                        <th>Adresse</th>
                        <th>Ville</th>
                        <th>Société</th>
                        <th>Tax ID</th>
                        <th>Licence</th>
                        <th>Account Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.type.toUpperCase()}</td>
                            <td>{user.phone || "-"}</td>
                            <td>{user.address || "-"}</td>
                            <td>{user.city || "-"}</td>
                            <td>{user.type === "b2b" ? user.company_name : "-"}</td>
                            <td>{user.type === "b2b" ? user.tax_id : "-"}</td>
                            <td>{user.type === "b2b" ? user.license_number : "-"}</td>
                            <td>
                                {user.type === "b2b" ? (
                                    user.approved ? (
                                        <span className="status-approved">Validé</span>
                                    ) : (
                                        <span className="status-pending">En attente</span>
                                    )
                                ) : (
                                    <span className="status-approved">Validé</span>
                                )}
                            </td>

                            <td className="actions">
                                <button onClick={() => openEditModal(user)} title="Modifier">
                                    <FaEdit />
                                </button>
                                <button onClick={() => confirmDelete(user)} title="Supprimer">
                                    <FaTrash />
                                </button>
                                {user.type === "b2b" && !user.approved && (
                                    <button className="approve-btn" onClick={() => handleApprove(user.id)}
                                        title="Valider"
                                    >
                                        <FaCheck />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>

            {/* ADD / EDIT Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{editingUser ? "Modifier utilisateur" : "Ajouter utilisateur"}</h2>

                        <form onSubmit={handleSubmit}>
                            <input
                                name="name"
                                placeholder="Nom"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />

                            <input
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />

                            {!editingUser && (
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Mot de passe"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                            )}

                            <select name="type" value={form.type} onChange={handleChange}>
                                <option value="b2c">B2C</option>
                                <option value="b2b">B2B</option>
                            </select>

                            <input
                                name="phone"
                                placeholder="Téléphone"
                                value={form.phone}
                                onChange={handleChange}
                            />

                            <input
                                name="address"
                                placeholder="Adresse"
                                value={form.address}
                                onChange={handleChange}
                            />

                            <input
                                name="city"
                                placeholder="Ville"
                                value={form.city}
                                onChange={handleChange}
                            />

                            {form.type === "b2b" && (
                                <>
                                    <input
                                        name="company_name"
                                        placeholder="Société"
                                        value={form.company_name}
                                        onChange={handleChange}
                                    />

                                    <input
                                        name="tax_id"
                                        placeholder="Tax ID"
                                        value={form.tax_id}
                                        onChange={handleChange}
                                    />

                                    <input
                                        name="license_number"
                                        placeholder="Licence"
                                        value={form.license_number}
                                        onChange={handleChange}
                                    />
                                </>
                            )}

                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)}>
                                    Annuler
                                </button>
                                <button type="submit">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Confirmation Modal(DELETE) */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal delete-modal">
                        <h2>Confirmer la suppression</h2>
                        <p>Voulez-vous vraiment supprimer l’utilisateur <strong>{userToDelete?.name}</strong> ?</p>

                        <div className="modal-actions">
                            <button type="button" onClick={() => setShowDeleteModal(false)}>Annuler</button>
                            <button className="danger" onClick={handleDelete}>Supprimer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminUsers