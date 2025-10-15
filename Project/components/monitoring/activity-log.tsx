"use client"

import { useState, useEffect } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CyberCard } from "@/components/ui/cyber-card"
import { Clock, User, Shield, Scan, Key, Database } from "lucide-react"

interface ActivityLogEntry {
  id: string
  type: "scan" | "auth" | "vault" | "system" | "network"
  action: string
  user: string
  timestamp: string
  status: "success" | "warning" | "error"
  details?: string
}

export function ActivityLog() {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([])

  useEffect(() => {
    // Simulate activity log entries
    const mockActivities: ActivityLogEntry[] = [
      {
        id: "1",
        type: "scan",
        action: "URL Security Scan",
        user: "System",
        timestamp: "2 minutes ago",
        status: "success",
        details: "Scanned https://example.com - No threats detected",
      },
      {
        id: "2",
        type: "vault",
        action: "Vault Access",
        user: "Admin",
        timestamp: "5 minutes ago",
        status: "success",
        details: "Accessed login credentials for GitHub",
      },
      {
        id: "3",
        type: "network",
        action: "Network Scan",
        user: "System",
        timestamp: "8 minutes ago",
        status: "warning",
        details: "Detected unknown device on network",
      },
      {
        id: "4",
        type: "auth",
        action: "Login Attempt",
        user: "Unknown",
        timestamp: "12 minutes ago",
        status: "error",
        details: "Failed authentication from IP 192.168.1.200",
      },
      {
        id: "5",
        type: "system",
        action: "System Update",
        user: "System",
        timestamp: "15 minutes ago",
        status: "success",
        details: "Security definitions updated successfully",
      },
      {
        id: "6",
        type: "scan",
        action: "Breach Check",
        user: "Admin",
        timestamp: "18 minutes ago",
        status: "success",
        details: "Checked email admin@company.com - No breaches found",
      },
    ]

    setActivities(mockActivities)

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newActivity: ActivityLogEntry = {
        id: Date.now().toString(),
        type: ["scan", "auth", "vault", "system", "network"][Math.floor(Math.random() * 5)] as any,
        action: "Real-time Activity",
        user: "System",
        timestamp: "Just now",
        status: ["success", "warning"][Math.floor(Math.random() * 2)] as any,
        details: "Automated security monitoring activity",
      }

      setActivities((prev) => [newActivity, ...prev.slice(0, 9)])
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "scan":
        return <Scan className="h-4 w-4 text-primary glow-primary" />
      case "auth":
        return <User className="h-4 w-4 text-success glow-success" />
      case "vault":
        return <Key className="h-4 w-4 text-warning glow-warning" />
      case "system":
        return <Shield className="h-4 w-4 text-info glow-info" />
      case "network":
        return <Database className="h-4 w-4 text-secondary glow-secondary" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "outline"
      case "warning":
        return "secondary"
      case "error":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <CyberCard variant="circuit" className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary glow-primary" />
          Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 rounded-lg bg-background/50 border border-primary/20 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(activity.type)}
                    <div>
                      <div className="font-medium text-foreground">{activity.action}</div>
                      <div className="text-sm text-muted-foreground">by {activity.user}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(activity.status) as any}>{activity.status}</Badge>
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                  </div>
                </div>
                {activity.details && <p className="text-sm text-muted-foreground mt-2 pl-7">{activity.details}</p>}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </CyberCard>
  )
}
