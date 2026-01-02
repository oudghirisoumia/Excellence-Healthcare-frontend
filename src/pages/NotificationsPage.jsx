"use client"
import { useEffect, useState } from "react"
import NotificationPanel from "../components/NotificationPanel"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (token) {
      fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setNotifications(data.data)) 
    }
  }, [token])

  return (
    <div className="notifications-page">
      <NotificationPanel
        notifications={notifications}
        onClose={() => {}}
        onMarkAsRead={async () => {
          await fetch("/api/notifications/read-all", {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` }
          })
          const res = await fetch("/api/notifications", {
            headers: { Authorization: `Bearer ${token}` }
          })
          const data = await res.json()
          setNotifications(data.data)
        }}
      />
    </div>
  )
}
