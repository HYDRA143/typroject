"use client"

import { Shield, Activity, Lock, Settings, Wrench, Zap, Bell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const isActive = (path: string) => pathname === path

  const notifications = [
    { id: 1, type: "warning", message: "Suspicious network activity detected", time: "2 min ago" },
    { id: 2, type: "info", message: "System scan completed successfully", time: "5 min ago" },
    { id: 3, type: "alert", message: "New security update available", time: "10 min ago" },
  ]

  return (
    <nav className="w-full bg-black/90 backdrop-blur-md border-b border-cyan-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Shield className="h-10 w-10 text-cyan-400 transition-all duration-300 group-hover:scale-110" />
              <div className="absolute -top-1 -right-1">
                <Zap className="h-4 w-4 text-green-400" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-cyan-400 font-mono group-hover:text-cyan-300 transition-colors duration-300">
                MOBICURE
              </h1>
              <div className="h-0.5 bg-gradient-to-r from-cyan-400 to-green-400 w-full"></div>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <Button
                variant="ghost"
                className={`transition-all duration-300 ${
                  isActive("/")
                    ? "text-cyan-400 bg-cyan-400/20 border border-cyan-400/30"
                    : "text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10"
                }`}
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/tools">
              <Button
                variant="ghost"
                className={`transition-all duration-300 ${
                  isActive("/tools")
                    ? "text-cyan-400 bg-cyan-400/20 border border-cyan-400/30"
                    : "text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10"
                }`}
              >
                <Wrench className="h-4 w-4 mr-2" />
                Tools
              </Button>
            </Link>
            <Link href="/vault">
              <Button
                variant="ghost"
                className={`transition-all duration-300 ${
                  isActive("/vault")
                    ? "text-cyan-400 bg-cyan-400/20 border border-cyan-400/30"
                    : "text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10"
                }`}
              >
                <Lock className="h-4 w-4 mr-2" />
                Privacy Vault
              </Button>
            </Link>
            <Link href="/settings">
              <Button
                variant="ghost"
                className={`transition-all duration-300 ${
                  isActive("/settings")
                    ? "text-cyan-400 bg-cyan-400/20 border border-cyan-400/30"
                    : "text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10"
                }`}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400 font-medium">SECURE</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-cyan-400/10 transition-colors duration-300"
              >
                <Bell className="h-6 w-6 text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors duration-300 animate-pulse" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-bounce"></div>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-black/95 backdrop-blur-md border border-cyan-500/30 rounded-lg shadow-xl z-50">
                  <div className="p-4 border-b border-cyan-500/20">
                    <h3 className="text-cyan-400 font-semibold">Security Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-3 border-b border-gray-800/50 hover:bg-cyan-400/5 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`h-2 w-2 rounded-full mt-2 ${
                              notification.type === "alert"
                                ? "bg-red-400"
                                : notification.type === "warning"
                                  ? "bg-yellow-400"
                                  : "bg-green-400"
                            }`}
                          ></div>
                          <div className="flex-1">
                            <p className="text-gray-300 text-sm">{notification.message}</p>
                            <p className="text-gray-500 text-xs mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Activity className="h-6 w-6 text-cyan-400" />

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-cyan-400/10 transition-colors duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6 text-cyan-400" /> : <Menu className="h-6 w-6 text-cyan-400" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-cyan-500/20">
            <div className="flex flex-col space-y-2 pt-4">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start transition-all duration-300 ${
                    isActive("/")
                      ? "text-cyan-400 bg-cyan-400/20 border border-cyan-400/30"
                      : "text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10"
                  }`}
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/tools" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start transition-all duration-300 ${
                    isActive("/tools")
                      ? "text-cyan-400 bg-cyan-400/20 border border-cyan-400/30"
                      : "text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10"
                  }`}
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Tools
                </Button>
              </Link>
              <Link href="/vault" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start transition-all duration-300 ${
                    isActive("/vault")
                      ? "text-cyan-400 bg-cyan-400/20 border border-cyan-400/30"
                      : "text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10"
                  }`}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Privacy Vault
                </Button>
              </Link>
              <Link href="/settings" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start transition-all duration-300 ${
                    isActive("/settings")
                      ? "text-cyan-400 bg-cyan-400/20 border border-cyan-400/30"
                      : "text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10"
                  }`}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
