"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Camera, Upload, CheckCircle, XCircle, ExternalLink } from "lucide-react"

interface QRScanResult {
  data: string
  type: "URL" | "Text" | "Email" | "Phone" | "WiFi" | "Unknown"
  isSecure: boolean
  threats: {
    type: string
    description: string
    severity: string
  }[]
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  recommendations: string[]
}

export default function QRCodeScanner() {
  const [file, setFile] = useState<File | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<QRScanResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scanQRCode = async () => {
    if (!file) return

    setIsScanning(true)

    // Simulate QR code scanning and analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate different types of QR code content
    const mockData = [
      "https://example.com/login",
      "https://bit.ly/suspicious-link",
      "mailto:contact@example.com",
      "tel:+1234567890",
      "WIFI:T:WPA;S:MyNetwork;P:password123;;",
      "Just some plain text content",
    ]

    const data = mockData[Math.floor(Math.random() * mockData.length)]
    const type = detectQRType(data)
    const threats = analyzeThreats(data, type)
    const isSecure = threats.length === 0
    const riskLevel = calculateRiskLevel(threats)

    setResult({
      data,
      type,
      isSecure,
      threats,
      riskLevel,
      recommendations: generateRecommendations(type, threats),
    })

    setIsScanning(false)
  }

  const detectQRType = (data: string): QRScanResult["type"] => {
    if (data.startsWith("http://") || data.startsWith("https://")) return "URL"
    if (data.startsWith("mailto:")) return "Email"
    if (data.startsWith("tel:")) return "Phone"
    if (data.startsWith("WIFI:")) return "WiFi"
    return "Text"
  }

  const analyzeThreats = (data: string, type: QRScanResult["type"]) => {
    const threats = []

    if (type === "URL") {
      if (data.includes("bit.ly") || data.includes("tinyurl")) {
        threats.push({
          type: "URL Shortener",
          description: "Link uses URL shortening service, destination unknown",
          severity: "Medium",
        })
      }

      if (data.startsWith("http://")) {
        threats.push({
          type: "Insecure Connection",
          description: "URL uses unencrypted HTTP protocol",
          severity: "Medium",
        })
      }

      if (Math.random() > 0.7) {
        threats.push({
          type: "Suspicious Domain",
          description: "Domain appears in threat intelligence feeds",
          severity: "High",
        })
      }
    }

    if (type === "WiFi" && data.includes("P:")) {
      threats.push({
        type: "WiFi Credentials Exposed",
        description: "QR code contains WiFi password in plain text",
        severity: "Low",
      })
    }

    return threats
  }

  const calculateRiskLevel = (threats: any[]): QRScanResult["riskLevel"] => {
    if (threats.some((t) => t.severity === "Critical")) return "Critical"
    if (threats.some((t) => t.severity === "High")) return "High"
    if (threats.some((t) => t.severity === "Medium")) return "Medium"
    return "Low"
  }

  const generateRecommendations = (type: QRScanResult["type"], threats: any[]) => {
    const recommendations = []

    if (type === "URL") {
      recommendations.push("Verify the destination URL before clicking")
      recommendations.push("Check for HTTPS encryption")
      if (threats.some((t) => t.type === "URL Shortener")) {
        recommendations.push("Expand shortened URLs to see actual destination")
      }
    }

    if (type === "WiFi") {
      recommendations.push("Only connect to trusted WiFi networks")
      recommendations.push("Verify network name with the owner")
    }

    if (threats.length === 0) {
      recommendations.push("QR code appears safe to use")
    } else {
      recommendations.push("Exercise caution when using this QR code")
    }

    return recommendations
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Critical":
        return "text-red-500 border-red-500"
      case "High":
        return "text-orange-500 border-orange-500"
      case "Medium":
        return "text-yellow-500 border-yellow-500"
      default:
        return "text-green-500 border-green-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="qr-image">QR Code Image</Label>
          <Input
            id="qr-image"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="cyber-input"
            ref={fileInputRef}
          />
        </div>

        <Button onClick={scanQRCode} disabled={!file || isScanning} className="cyber-button">
          {isScanning ? (
            <>
              <Camera className="w-4 h-4 mr-2 animate-spin" />
              Scanning QR Code...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Scan QR Code
            </>
          )}
        </Button>
      </div>

      {result && (
        <div className="space-y-4">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.isSecure ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                QR Code Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Content Type:</span>
                <Badge variant="outline">{result.type}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Risk Level:</span>
                <Badge className={getRiskColor(result.riskLevel)}>{result.riskLevel}</Badge>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Decoded Content</h4>
                <div className="p-3 bg-background/50 border border-primary/20 rounded-lg">
                  <div className="text-sm font-mono break-all">{result.data}</div>
                  {result.type === "URL" && (
                    <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Open Link (Use Caution)
                    </Button>
                  )}
                </div>
              </div>

              {result.threats.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Security Threats
                  </h4>
                  <div className="space-y-2">
                    {result.threats.map((threat, index) => (
                      <div key={index} className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <div className="font-medium text-orange-400">{threat.type}</div>
                        <div className="text-sm text-muted-foreground mt-1">{threat.description}</div>
                        <Badge className="mt-2" variant={threat.severity === "High" ? "destructive" : "secondary"}>
                          {threat.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Security Recommendations
                </h4>
                <ul className="space-y-1">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
