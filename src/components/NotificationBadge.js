"use client"
import "../styles/NotificationBadge.css"

const NotificationBadge = ({ count, onClick }) => {
  return (
    <button className="notification-badge-btn" onClick={onClick}>
      <i className="fas fa-bell"></i>
      {count > 0 && <span className="badge-count">{count}</span>}
    </button>
  )
}

export default NotificationBadge
