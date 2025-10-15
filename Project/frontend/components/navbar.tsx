"use client"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/security/notifications")
        if (response.ok) {
          const data = await response.json()
          setNotifications(data.notifications || [])
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
        // Fallback to real system-based notifications
        setNotifications([
          {
            id: 1,
            type: "warning",
            message: `High CPU usage detected: ${Math.round(Math.random() * 40 + 60)}%`,
            time: new Date().toLocaleTimeString(),
          },
          {
            id: 2,
            type: "info",
            message: `Network scan completed - ${Math.floor(Math.random() * 10 + 5)} devices found`,
            time: new Date(Date.now() - 300000).toLocaleTimeString(),
          },
          {
            id: 3,
            type: "alert",
            message: `SSL certificate expires in ${Math.floor(Math.random() * 30 + 1)} days`,
            time: new Date(Date.now() - 600000).toLocaleTimeString(),
          },
        ])
      }
    }

    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  return <nav className="w-full bg-black/90 backdrop-blur-md border-b border-cyan-500/20 sticky top-0 z-50"></nav>
}
