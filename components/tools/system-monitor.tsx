"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Monitor, Cpu, HardDrive, Wifi, AlertTriangle, Activity } from "lucide-react"

interface SystemStats {
  cpu: number
  memory: number
  disk: number
  network: number
  processes: number
  threats: number
}

interface ProcessInfo {
  name: string
  cpu: number
  memory: number
  status: "Normal" | "Suspicious" | "High Usage"
}

export function SystemMonitor() {
  const [stats, setStats] = useState<SystemStats>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    processes: 0,
    threats: 0,
  })

  const [processes, setProcesses] = useState<ProcessInfo[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        // Simulate real system monitoring
        const newStats: SystemStats = {
          cpu: Math.floor(Math.random() * 100),
          memory: Math.floor(Math.random() * 100),
          disk: Math.floor(Math.random() * 100),
          network: Math.floor(Math.random() * 1000),
          processes: Math.floor(Math.random() * 200) + 50,
          threats: Math.floor(Math.random() * 5),
        }

        setStats(newStats)

        // Generate realistic process list
        const processNames = [
          "chrome.exe",
          "firefox.exe",
          "code.exe",
          "node.exe",
          "python.exe",
          "system",
          "explorer.exe",
          "winlogon.exe",
          "services.exe",
          "lsass.exe",
        ]

        const newProcesses: ProcessInfo[] = processNames.map((name) => ({
          name,
          cpu: Math.floor(Math.random() * 50),
          memory: Math.floor(Math.random() * 1000),
          status: Math.random() > 0.8 ? "High Usage" : Math.random() > 0.95 ? "Suspicious" : "Normal",
        }))

        setProcesses(newProcesses)
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isMonitoring])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Normal":
        return "text-success"
      case "High Usage":
        return "text-yellow-500"
      case "Suspicious":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getProgressColor = (value: number) => {
    if (value > 80) return "bg-red-500"
    if (value > 60) return "bg-yellow-500"
    return "bg-success"
  }

  return (
    <div className="space-y-6">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Monitor className="h-5 w-5 mr-2 text-primary" />
              System Monitor
            </div>
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`px-4 py-2 rounded-lg transition-all ${
                isMonitoring
                  ? "bg-red-500/20 text-red-500 border border-red-500/50"
                  : "bg-success/20 text-success border border-success/50"
              }`}
            >
              {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="cyber-card p-4">
              <div className="flex items-center justify-between mb-2">
                <Cpu className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold">{stats.cpu}%</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">CPU Usage</p>
              <Progress value={stats.cpu} className="h-2" />
            </div>

            <div className="cyber-card p-4">
              <div className="flex items-center justify-between mb-2">
                <HardDrive className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold">{stats.memory}%</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Memory</p>
              <Progress value={stats.memory} className="h-2" />
            </div>

            <div className="cyber-card p-4">
              <div className="flex items-center justify-between mb-2">
                <Wifi className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold">{stats.network} KB/s</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Network</p>
              <Progress value={Math.min(stats.network / 10, 100)} className="h-2" />
            </div>

            <div className="cyber-card p-4">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className="text-sm font-semibold">{stats.threats}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Threats</p>
              <div className={`h-2 rounded-full ${stats.threats > 0 ? "bg-red-500" : "bg-success"}`} />
            </div>
          </div>
        </CardContent>
      </Card>

      {isMonitoring && (
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              Active Processes ({stats.processes})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {processes.map((process, index) => (
                <div key={index} className="flex items-center justify-between p-3 cyber-card">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        process.status === "Normal"
                          ? "bg-success"
                          : process.status === "High Usage"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                    <span className="font-medium">{process.name}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>CPU: {process.cpu}%</span>
                    <span>RAM: {process.memory}MB</span>
                    <span className={getStatusColor(process.status)}>{process.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
