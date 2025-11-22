"use client"
import "../styles/NotificationPanel.css"
import { useNavigate } from "react-router-dom"

const NotificationPanel = ({ notifications, onClose, onMarkAsRead }) => {
  const navigate = useNavigate()
  const unreadCount = notifications.filter((n) => !n.read).length

  const handleNotificationAction = (notification) => {
    if (notification.type === "shipping") {
      navigate("/order-tracking")
      onClose()
    } else if (notification.type === "promo") {
      navigate("/products")
      onClose()
    }
  }

  return (
    <div className="notification-overlay" onClick={onClose}>
      <div className="notification-panel" onClick={(e) => e.stopPropagation()}>
        <div className="notification-header">
          <h3>Notifications</h3>
          <p className="notification-count">{unreadCount} nouvelles notifications</p>
          <button className="mark-all-btn">Tout marquer lu</button>
        </div>

        <div className="notification-list">
          {notifications.map((notification) => (
            <div key={notification.id} className={`notification-item ${!notification.read ? "unread" : ""}`}>
              <div className="notification-icon">
                <i className={notification.icon}></i>
              </div>

              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.description}</p>
                <span className="notification-time">{notification.time}</span>
              </div>

              <div className="notification-status">{!notification.read && <div className="unread-dot"></div>}</div>

              <button className="notification-action-btn" onClick={() => handleNotificationAction(notification)}>
                {notification.type === "promo" && "Voir l'offre"}
                {notification.type === "shipping" && "Suivre ma commande"}
                {notification.type === "product" && "Voir le produit"}
              </button>
            </div>
          ))}
        </div>

        <div className="notification-footer">
          <button className="view-all-btn" onClick={() => navigate("/order-tracking")}>
            Voir toutes les notifications
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationPanel
