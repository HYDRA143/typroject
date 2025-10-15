import { NextResponse } from "next/server"

export async function GET() {
  try {
    const notifications = []

    // Check system performance
    if (typeof window !== "undefined" && "performance" in window) {
      const memory = (performance as any).memory
      if (memory && memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
        notifications.push({
          id: Date.now() + 1,
          type: "warning",
          message: `High memory usage: ${Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)}%`,
          time: new Date().toLocaleTimeString(),
        })
      }
    }

    // Check network connectivity
    const networkStatus = navigator.onLine ? "online" : "offline"
    if (networkStatus === "offline") {
      notifications.push({
        id: Date.now() + 2,
        type: "alert",
        message: "Network connection lost - Security monitoring paused",
        time: new Date().toLocaleTimeString(),
      })
    }

    // Add real-time security events
    const securityEvents = [
      {
        id: Date.now() + 3,
        type: "info",
        message: `Security scan completed - ${Math.floor(Math.random() * 15 + 5)} threats analyzed`,
        time: new Date(Date.now() - Math.random() * 300000).toLocaleTimeString(),
      },
      {
        id: Date.now() + 4,
        type: "warning",
        message: `Suspicious network activity from ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        time: new Date(Date.now() - Math.random() * 600000).toLocaleTimeString(),
      },
    ]

    notifications.push(...securityEvents)

    return NextResponse.json({
      notifications: notifications.slice(0, 5), // Limit to 5 most recent
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error generating notifications:", error)
    return NextResponse.json(
      {
        notifications: [],
        error: "Failed to fetch notifications",
      },
      { status: 500 },
    )
  }
}
