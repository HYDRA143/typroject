"use client"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

type NotificationItem = {
  id: number
  type: "warning" | "info" | "alert" | string
  message: string
  time: string
}

export function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/security/notifications")
        if (!mounted) return
        if (response.ok) {
          const data = await response.json()
          setNotifications(data.notifications || [])
          return
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      }

      // Fallback sample notifications
      if (!mounted) return
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

    fetchNotifications()
    const intervalId = window.setInterval(fetchNotifications, 30000) // update every 30s
    return () => {
      mounted = false
      clearInterval(intervalId)
    }
  }, [])

  // close dropdowns when clicking outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current) return
      if (e.target instanceof Node && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  const unreadCount = notifications.length

  return (
    <nav className="w-full bg-black/90 backdrop-blur-md border-b border-cyan-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-4">
            <a href="/" className="text-white font-semibold text-lg">
              TyProject
            </a>

            <div className="hidden md:flex items-center space-x-2">
              <a
                href="/"
                className={
                  "px-3 py-1 rounded-md text-sm " +
                  (pathname === "/" ? "bg-cyan-500/20 text-cyan-300" : "text-gray-300 hover:text-white")
                }
              >
                Home
              </a>
              <a
                href="/dashboard"
                className={
                  "px-3 py-1 rounded-md text-sm " +
                  (pathname?.startsWith("/dashboard") ? "bg-cyan-500/20 text-cyan-300" : "text-gray-300 hover:text-white")
                }
              >
                Dashboard
              </a>
              <a
                href="/security"
                className={
                  "px-3 py-1 rounded-md text-sm " +
                  (pathname?.startsWith("/security") ? "bg-cyan-500/20 text-cyan-300" : "text-gray-300 hover:text-white")
                }
              >
                Security
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative" ref={dropdownRef}>
              <button
                aria-label="Notifications"
                className="relative p-2 rounded-full text-gray-200 hover:text-white hover:bg-white/5"
                onClick={() => setShowNotifications((s) => !s)}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium leading-none text-white bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white/95 dark:bg-gray-900 border border-gray-700 rounded-md shadow-lg overflow-hidden">
                  <div className="p-2 text-sm font-semibold border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900">
                    Notifications
                  </div>
                  <div className="max-h-64 overflow-auto">
                    {notifications.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500">No notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-start gap-2">
                          <div className="mt-0.5">
                            {n.type === "warning" ? (
                              <span className="text-yellow-500">⚠️</span>
                            ) : n.type === "alert" ? (
                              <span className="text-red-400">🚨</span>
                            ) : (
                              <span className="text-cyan-400">ℹ️</span>
                            )}
                          </div>
                          <div className="flex-1 text-sm">
                            <div className="text-gray-900 dark:text-gray-100">{n.message}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{n.time}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t border-gray-200 dark:border-gray-800">
                    <button
                      className="w-full text-sm text-cyan-500 hover:underline"
                      onClick={() => {
                        setNotifications([])
                        setShowNotifications(false)
                      }}
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/5"
              aria-label="Toggle menu"
              onClick={() => setIsMenuOpen((s) => !s)}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-3">
            <a href="/" className="block px-3 py-2 rounded-md text-base text-gray-300 hover:text-white">Home</a>
            <a href="/dashboard" className="block px-3 py-2 rounded-md text-base text-gray-300 hover:text-white">Dashboard</a>
            <a href="/security" className="block px-3 py-2 rounded-md text-base text-gray-300 hover:text-white">Security</a>
          </div>
        )}
      </div>
    </nav>
  )
}
