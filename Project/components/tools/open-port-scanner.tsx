"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Scan, Shield, AlertTriangle, CheckCircle, Network } from "lucide-react"

interface PortScanResult {
  port: number
  status: "open" | "closed" | "filtered"
  service: string
  version?: string
  risk: "low" | "medium" | "high"
  description: string
}

interface ScanResults {
  target: string
  totalPorts: number
  openPorts: number
  closedPorts: number
  filteredPorts: number
  scanTime: number
  ports: PortScanResult[]
}

export default function OpenPortScanner() {
  const [target, setTarget] = useState("")
  const [portRange, setPortRange] = useState("1-1000")
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<ScanResults | null>(null)

  const commonPorts = [
    { port: 21, service: "FTP", risk: "medium" as const, description: "File Transfer Protocol" },
    { port: 22, service: "SSH", risk: "low" as const, description: "Secure Shell" },
    { port: 23, service: "Telnet", risk: "high" as const, description: "Unencrypted remote access" },
    { port: 25, service: "SMTP", risk: "medium" as const, description: "Simple Mail Transfer Protocol" },
    { port: 53, service: "DNS", risk: "low" as const, description: "Domain Name System" },
    { port: 80, service: "HTTP", risk: "low" as const, description: "Web server" },
    { port: 110, service: "POP3", risk: "medium" as const, description: "Post Office Protocol" },
    { port: 143, service: "IMAP", risk: "medium" as const, description: "Internet Message Access Protocol" },
    { port: 443, service: "HTTPS", risk: "low" as const, description: "Secure web server" },
    { port: 993, service: "IMAPS", risk: "low" as const, description: "Secure IMAP" },
    { port: 995, service: "POP3S", risk: "low" as const, description: "Secure POP3" },
    { port: 3389, service: "RDP", risk: "high" as const, description: "Remote Desktop Protocol" },
    { port: 5432, service: "PostgreSQL", risk: "high" as const, description: "PostgreSQL Database" },
    { port: 3306, service: "MySQL", risk: "high" as const, description: "MySQL Database" },
    { port: 1433, service: "MSSQL", risk: "high" as const, description: "Microsoft SQL Server" },
  ]

  const scanPorts = async () => {
    if (!target) return

    setIsScanning(true)
    setProgress(0)

    const [startPort, endPort] = portRange.split("-").map(Number)
    const totalPorts = endPort - startPort + 1
    const scanResults: PortScanResult[] = []

    // Simulate port scanning
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    // Generate realistic scan results
    commonPorts.forEach((portInfo) => {
      if (portInfo.port >= startPort && portInfo.port <= endPort) {
        const isOpen = Math.random() > 0.7 // 30% chance of being open
        const status = isOpen ? "open" : Math.random() > 0.5 ? "closed" : "filtered"

        scanResults.push({
          port: portInfo.port,
          status: status as any,
          service: portInfo.service,
          version: isOpen
            ? `${portInfo.service} v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}`
            : undefined,
          risk: portInfo.risk,
          description: portInfo.description,
        })
      }
    })

    // Add some random ports
    for (let i = 0; i < Math.min(10, totalPorts - scanResults.length); i++) {
      const randomPort = Math.floor(Math.random() * (endPort - startPort)) + startPort
      if (!scanResults.find((r) => r.port === randomPort)) {
        const status = Math.random() > 0.8 ? "open" : "closed"
        scanResults.push({
          port: randomPort,
          status: status as any,
          service: "Unknown",
          risk: "medium",
          description: "Unknown service",
        })
      }
    }

    scanResults.sort((a, b) => a.port - b.port)

    const openPorts = scanResults.filter((r) => r.status === "open").length
    const closedPorts = scanResults.filter((r) => r.status === "closed").length
    const filteredPorts = scanResults.filter((r) => r.status === "filtered").length

    setResults({
      target,
      totalPorts: scanResults.length,
      openPorts,
      closedPorts,
      filteredPorts,
      scanTime: Math.floor(Math.random() * 30) + 10,
      ports: scanResults,
    })

    setIsScanning(false)
    setProgress(100)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-400 bg-green-400/20"
      case "medium":
        return "text-yellow-400 bg-yellow-400/20"
      case "high":
        return "text-red-400 bg-red-400/20"
      default:
        return "text-gray-400 bg-gray-400/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "closed":
        return <Shield className="w-4 h-4 text-gray-400" />
      case "filtered":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Target IP or domain"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="md:col-span-1"
        />
        <Input
          placeholder="Port range (e.g., 1-1000)"
          value={portRange}
          onChange={(e) => setPortRange(e.target.value)}
        />
        <Button onClick={scanPorts} disabled={!target || isScanning} className="bg-primary hover:bg-primary/80">
          {isScanning ? "Scanning..." : "Start Scan"}
        </Button>
      </div>

      {isScanning && (
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Scanning ports...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {results && (
        <div className="space-y-6">
          {/* Scan Summary */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5 text-primary" />
                Scan Results for {results.target}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{results.totalPorts}</div>
                  <div className="text-sm text-muted-foreground">Total Ports</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{results.openPorts}</div>
                  <div className="text-sm text-muted-foreground">Open</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-400">{results.closedPorts}</div>
                  <div className="text-sm text-muted-foreground">Closed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{results.filteredPorts}</div>
                  <div className="text-sm text-muted-foreground">Filtered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{results.scanTime}s</div>
                  <div className="text-sm text-muted-foreground">Scan Time</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Port Details */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="w-5 h-5 text-primary" />
                Port Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.ports.map((port, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-primary/10"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(port.status)}
                      <div>
                        <div className="font-medium">Port {port.port}</div>
                        <div className="text-sm text-muted-foreground">{port.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-medium">{port.service}</div>
                        {port.version && <div className="text-sm text-muted-foreground">{port.version}</div>}
                      </div>
                      <Badge className={getRiskColor(port.risk)}>{port.risk.toUpperCase()}</Badge>
                      <Badge variant={port.status === "open" ? "default" : "secondary"}>
                        {port.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
