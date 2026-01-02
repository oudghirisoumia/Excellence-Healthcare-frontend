import "../styles/NotificationPanel.css"

const NotificationPanel = ({ notifications, onMarkAsRead, onClose }) => {
  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => Number(n.is_read) === 0).length
    : 0

  return (
<div className="notification-overlay" onClick={onClose}>
      <div className="notification-panel" onClick={(e) => e.stopPropagation()}>
        <div className="notification-header">
          <h3>Notifications</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>

          <p className="notification-count">{unreadCount} nouvelles notifications</p>
          <button className="mark-all-btn" onClick={onMarkAsRead}>
            Tout marquer lu
          </button>
        </div>

        <div className="notification-list">
          {Array.isArray(notifications) &&
            notifications.map((notification) => (
              <div key={notification.id} className={`notification-item ${!notification.is_read ? "unread" : ""}`}>
                <div className="notification-icon">
                  <i className={notification.icon}></i>
                </div>

                <div className="notification-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <span className="notification-time">{notification.created_at}</span>
                </div>

                <div className="notification-status">
                  {!notification.is_read && <div className="unread-dot"></div>}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default NotificationPanel