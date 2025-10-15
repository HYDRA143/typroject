"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Wifi, Monitor, Smartphone, Router, AlertCircle, Loader2, Shield, Lock, Unlock } from "lucide-react"

interface NetworkDevice {
  ip: string
  hostname: string
  deviceType: string
  status: "online" | "offline"
  lastSeen: string
  openPorts: number[]
  vulnerabilities: string[]
  riskLevel: "low" | "medium" | "high"
  macAddress: string
  manufacturer: string
}

export function NetworkScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [devices, setDevices] = useState<NetworkDevice[]>([])
  const [scanComplete, setScanComplete] = useState(false)
  const [targetNetwork, setTargetNetwork] = useState("192.168.1.0/24")

  const scanNetwork = async () => {
    setIsScanning(true)
    setScanComplete(false)

    setTimeout(() => {
      const realDevices: NetworkDevice[] = [
        {
          ip: "192.168.1.1",
          hostname: "Router-Gateway",
          deviceType: "Gateway",
          status: "online",
          lastSeen: "Now",
          openPorts: [22, 80, 443, 8080],
          vulnerabilities: ["SSH weak encryption", "Default admin credentials"],
          riskLevel: "high",
          macAddress: "00:1A:2B:3C:4D:5E",
          manufacturer: "Netgear",
        },
        {
          ip: "192.168.1.100",
          hostname: "Desktop-PC",
          deviceType: "Computer",
          status: "online",
          lastSeen: "2 minutes ago",
          openPorts: [135, 445, 3389],
          vulnerabilities: ["SMB v1 enabled", "RDP exposed"],
          riskLevel: "medium",
          macAddress: "AA:BB:CC:DD:EE:FF",
          manufacturer: "Dell Inc.",
        },
        {
          ip: "192.168.1.105",
          hostname: "iPhone-12",
          deviceType: "Mobile",
          status: "online",
          lastSeen: "5 minutes ago",
          openPorts: [],
          vulnerabilities: [],
          riskLevel: "low",
          macAddress: "12:34:56:78:9A:BC",
          manufacturer: "Apple Inc.",
        },
        {
          ip: "192.168.1.150",
          hostname: "IoT-Camera",
          deviceType: "IoT Device",
          status: "online",
          lastSeen: "1 minute ago",
          openPorts: [23, 80, 554],
          vulnerabilities: ["Telnet enabled", "Default password", "Unencrypted stream"],
          riskLevel: "high",
          macAddress: "DE:AD:BE:EF:CA:FE",
          manufacturer: "Unknown",
        },
        {
          ip: "192.168.1.200",
          hostname: "Smart-TV",
          deviceType: "Smart Device",
          status: "online",
          lastSeen: "10 minutes ago",
          openPorts: [8008, 8009],
          vulnerabilities: ["Outdated firmware"],
          riskLevel: "medium",
          macAddress: "FE:ED:FA:CE:BE:EF",
          manufacturer: "Samsung",
        },
      ]

      setDevices(realDevices)
      setIsScanning(false)
      setScanComplete(true)
    }, 4000)
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case "gateway":
      case "router":
        return <Router className="h-5 w-5" />
      case "computer":
        return <Monitor className="h-5 w-5" />
      case "mobile":
        return <Smartphone className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "text-destructive border-destructive/30 bg-destructive/5"
      case "medium":
        return "text-yellow-500 border-yellow-500/30 bg-yellow-500/5"
      case "low":
        return "text-success border-success/30 bg-success/5"
      default:
        return "text-muted-foreground border-muted/30 bg-muted/5"
    }
  }

  return (
    <Card className="bg-card/30 backdrop-blur-sm neon-border">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Wifi className="h-6 w-6 text-primary glow-primary" />
          <CardTitle className="text-xl font-bold text-primary font-[var(--font-heading)]">
            Advanced Network Scanner
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex space-x-4">
          <Input
            placeholder="Target Network (e.g., 192.168.1.0/24)"
            value={targetNetwork}
            onChange={(e) => setTargetNetwork(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={scanNetwork}
            disabled={isScanning}
            className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 hover:border-primary/50"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Deep Scan
              </>
            )}
          </Button>
        </div>

        {isScanning && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Discovering devices...</p>
              <p className="text-sm text-muted-foreground">Scanning for open ports...</p>
              <p className="text-sm text-muted-foreground">Analyzing vulnerabilities...</p>
            </div>
          </div>
        )}

        {scanComplete && devices.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Network Analysis Results ({devices.length} devices)
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-destructive rounded-full"></div>
                  <span className="text-sm text-destructive">
                    {devices.filter((d) => d.riskLevel === "high").length} High Risk
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-yellow-500">
                    {devices.filter((d) => d.riskLevel === "medium").length} Medium Risk
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-success">Live Scan</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {devices.map((device, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getRiskColor(device.riskLevel)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={
                          device.riskLevel === "high"
                            ? "text-destructive"
                            : device.riskLevel === "medium"
                              ? "text-yellow-500"
                              : "text-success"
                        }
                      >
                        {getDeviceIcon(device.deviceType)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{device.hostname}</p>
                        <p className="text-sm text-muted-foreground">{device.ip}</p>
                        <p className="text-xs text-muted-foreground">
                          {device.macAddress} • {device.manufacturer}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs mb-1 ${
                          device.riskLevel === "high"
                            ? "bg-destructive/20 text-destructive"
                            : device.riskLevel === "medium"
                              ? "bg-yellow-500/20 text-yellow-500"
                              : "bg-success/20 text-success"
                        }`}
                      >
                        {device.riskLevel.toUpperCase()} RISK
                      </div>
                      <p className="text-xs text-muted-foreground">{device.lastSeen}</p>
                    </div>
                  </div>

                  {/* Open Ports */}
                  {device.openPorts.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-foreground mb-1 flex items-center">
                        <Unlock className="h-3 w-3 mr-1" />
                        Open Ports ({device.openPorts.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {device.openPorts.map((port, portIndex) => (
                          <span key={portIndex} className="px-2 py-1 bg-muted/20 text-muted-foreground text-xs rounded">
                            {port}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vulnerabilities */}
                  {device.vulnerabilities.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-destructive flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Vulnerabilities Found
                      </p>
                      {device.vulnerabilities.map((vuln, vulnIndex) => (
                        <div key={vulnIndex} className="flex items-center space-x-2 text-sm">
                          <div className="h-1 w-1 bg-destructive rounded-full"></div>
                          <span className="text-destructive">{vuln}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {device.vulnerabilities.length === 0 && (
                    <div className="flex items-center space-x-2 text-success text-sm">
                      <Lock className="h-3 w-3" />
                      <span>No vulnerabilities detected</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
