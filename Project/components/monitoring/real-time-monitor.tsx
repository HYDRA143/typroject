"use client"

import { useState, useEffect } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CyberCard } from "@/components/ui/cyber-card"
import { Activity, Wifi, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface NetworkDevice {
  id: string
  name: string
  ip: string
  status: "online" | "offline" | "suspicious"
  lastSeen: string
}

interface SecurityAlert {
  id: string
  type: "warning" | "critical" | "info"
  message: string
  timestamp: string
  resolved: boolean
}

export function RealTimeMonitor() {
  const [networkDevices, setNetworkDevices] = useState<NetworkDevice[]>([])
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([])
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    networkTraffic: 0,
    activeConnections: 0,
  })

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update system metrics
      setSystemMetrics({
        cpuUsage: Math.floor(Math.random() * 100),
        memoryUsage: Math.floor(Math.random() * 100),
        networkTraffic: Math.floor(Math.random() * 1000),
        activeConnections: Math.floor(Math.random() * 50) + 10,
      })

      // Simulate network devices
      setNetworkDevices([
        { id: "1", name: "Router", ip: "192.168.1.1", status: "online", lastSeen: "Now" },
        { id: "2", name: "Desktop-PC", ip: "192.168.1.100", status: "online", lastSeen: "2s ago" },
        { id: "3", name: "Mobile-Device", ip: "192.168.1.101", status: "online", lastSeen: "5s ago" },
        { id: "4", name: "Unknown-Device", ip: "192.168.1.150", status: "suspicious", lastSeen: "1m ago" },
      ])

      // Simulate security alerts
      const alerts: SecurityAlert[] = [
        {
          id: "1",
          type: "critical",
          message: "Suspicious login attempt detected",
          timestamp: "2 min ago",
          resolved: false,
        },
        {
          id: "2",
          type: "warning",
          message: "Unusual network traffic pattern",
          timestamp: "5 min ago",
          resolved: false,
        },
        {
          id: "3",
          type: "info",
          message: "System scan completed successfully",
          timestamp: "10 min ago",
          resolved: true,
        },
      ]
      setSecurityAlerts(alerts)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-success glow-success" />
      case "offline":
        return <XCircle className="h-4 w-4 text-muted-foreground" />
      case "suspicious":
        return <AlertTriangle className="h-4 w-4 text-destructive glow-destructive" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "destructive"
      case "warning":
        return "secondary"
      case "info":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CyberCard variant="hologram">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary glow-primary" />
              CPU Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary font-[var(--font-heading)] mb-2">
              {systemMetrics.cpuUsage}%
            </div>
            <Progress value={systemMetrics.cpuUsage} className="h-2" />
          </CardContent>
        </CyberCard>

        <CyberCard variant="matrix">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-success glow-success" />
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success font-[var(--font-heading)] mb-2">
              {systemMetrics.memoryUsage}%
            </div>
            <Progress value={systemMetrics.memoryUsage} className="h-2" />
          </CardContent>
        </CyberCard>

        <CyberCard variant="circuit">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wifi className="h-4 w-4 text-primary glow-primary" />
              Network Traffic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary font-[var(--font-heading)]">
              {systemMetrics.networkTraffic} KB/s
            </div>
          </CardContent>
        </CyberCard>

        <CyberCard variant="default">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-success glow-success" />
              Active Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success font-[var(--font-heading)]">
              {systemMetrics.activeConnections}
            </div>
          </CardContent>
        </CyberCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Devices */}
        <CyberCard variant="hologram">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-primary glow-primary" />
              Network Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {networkDevices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-primary/20"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(device.status)}
                    <div>
                      <div className="font-medium text-foreground">{device.name}</div>
                      <div className="text-sm text-muted-foreground">{device.ip}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={device.status === "suspicious" ? "destructive" : "outline"}>{device.status}</Badge>
                    <div className="text-xs text-muted-foreground mt-1">{device.lastSeen}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </CyberCard>

        {/* Security Alerts */}
        <CyberCard variant="matrix">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive glow-destructive" />
              Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityAlerts.map((alert) => (
                <div key={alert.id} className="p-3 rounded-lg bg-background/50 border border-primary/20">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={getAlertColor(alert.type) as any}>{alert.type}</Badge>
                    <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                  </div>
                  <p className="text-sm text-foreground mb-2">{alert.message}</p>
                  <div className="flex items-center gap-2">
                    {alert.resolved ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span className="text-xs text-muted-foreground">{alert.resolved ? "Resolved" : "Active"}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </CyberCard>
      </div>
    </div>
  )
}
