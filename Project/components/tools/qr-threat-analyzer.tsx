"use client"
import { useState, useRef } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Shield, Upload, QrCode, Link, Eye, Download } from "lucide-react"

interface QRAnalysisResult {
  qrData: string
  dataType: "url" | "text" | "email" | "phone" | "wifi" | "vcard" | "unknown"
  threats: Array<{
    type: string
    description: string
    severity: "low" | "medium" | "high" | "critical"
  }>
  urlAnalysis?: {
    domain: string
    reputation: string
    redirects: string[]
    certificates: any
    isPhishing: boolean
    isMalicious: boolean
  }
  riskScore: number
  threatLevel: "SAFE" | "SUSPICIOUS" | "DANGEROUS" | "MALICIOUS"
  recommendations: string[]
}

export function QRThreatAnalyzer() {
  const [activeTab, setActiveTab] = useState("scan")
  const [file, setFile] = useState<File | null>(null)
  const [qrText, setQrText] = useState("")
  const [generatedQR, setGeneratedQR] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<QRAnalysisResult | null>(null)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        setError("Please select an image file")
        return
      }
      setFile(selectedFile)
      setError("")
      setResult(null)
    }
  }

  const analyzeQR = async () => {
    if (!file) {
      setError("Please select a QR code image to analyze")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/analyze-qr", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to analyze QR code")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError("Failed to analyze QR code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const generateQR = async () => {
    if (!qrText.trim()) {
      setError("Please enter text to generate QR code")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/generate-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: qrText }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate QR code")
      }

      const data = await response.json()
      setGeneratedQR(data.qrCode)
    } catch (err) {
      setError("Failed to generate QR code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getThreatColor = (level: string) => {
    switch (level) {
      case "SAFE":
        return "text-green-400 border-green-400 bg-green-400/10"
      case "SUSPICIOUS":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/10"
      case "DANGEROUS":
        return "text-orange-400 border-orange-400 bg-orange-400/10"
      case "MALICIOUS":
        return "text-red-400 border-red-400 bg-red-400/10"
      default:
        return "text-gray-400 border-gray-400 bg-gray-400/10"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-blue-500/20 text-blue-400"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400"
      case "high":
        return "bg-orange-500/20 text-orange-400"
      case "critical":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <QrCode className="h-5 w-5 mr-2" />
            QR Code Security Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="scan" className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Scan & Analyze
              </TabsTrigger>
              <TabsTrigger value="generate" className="flex items-center">
                <QrCode className="h-4 w-4 mr-2" />
                Generate QR
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scan" className="space-y-4">
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center">
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                {file ? (
                  <div className="space-y-2">
                    <QrCode className="h-12 w-12 mx-auto text-primary" />
                    <p className="font-medium text-primary">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">Upload QR code image for analysis</p>
                    <Button onClick={() => fileInputRef.current?.click()} className="cyber-button">
                      Select QR Image
                    </Button>
                  </div>
                )}
              </div>

              <Button onClick={analyzeQR} disabled={!file || loading} className="cyber-button w-full">
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Analyzing QR Code...
                  </div>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Analyze QR Code
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="generate" className="space-y-4">
              <Input
                placeholder="Enter text, URL, or data to generate QR code"
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                className="w-full"
              />

              <Button onClick={generateQR} disabled={!qrText.trim() || loading} className="cyber-button w-full">
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Generating QR Code...
                  </div>
                ) : (
                  <>
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate Secure QR Code
                  </>
                )}
              </Button>

              {generatedQR && (
                <div className="text-center space-y-4">
                  <div className="inline-block p-4 bg-white rounded-lg">
                    <img src={generatedQR || "/placeholder.svg"} alt="Generated QR Code" className="w-48 h-48" />
                  </div>
                  <Button
                    onClick={() => {
                      const link = document.createElement("a")
                      link.href = generatedQR
                      link.download = "qr-code.png"
                      link.click()
                    }}
                    className="cyber-button"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 mt-4">{error}</div>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {/* Analysis Summary */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center text-primary">
                  <Shield className="h-5 w-5 mr-2" />
                  QR Analysis Results
                </span>
                <Badge className={getThreatColor(result.threatLevel)}>{result.threatLevel}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{result.riskScore}/100</div>
                  <div className="text-sm text-muted-foreground">Risk Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{result.dataType.toUpperCase()}</div>
                  <div className="text-sm text-muted-foreground">Data Type</div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <h4 className="font-medium text-primary mb-2">QR Code Content:</h4>
                <p className="text-sm text-muted-foreground break-all">{result.qrData}</p>
              </div>
            </CardContent>
          </Card>

          {/* Threat Analysis */}
          {result.threats.length > 0 && (
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="flex items-center text-red-400">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Security Threats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.threats.map((threat, index) => (
                  <div key={index} className="border border-red-500/20 rounded-lg p-4 bg-red-500/5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-red-400">{threat.type}</h4>
                      <Badge className={getSeverityColor(threat.severity)}>{threat.severity.toUpperCase()}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{threat.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* URL Analysis */}
          {result.urlAnalysis && (
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Link className="h-5 w-5 mr-2" />
                  URL Security Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-primary font-medium">Domain:</span>
                    <span className="ml-2 text-muted-foreground">{result.urlAnalysis.domain}</span>
                  </div>
                  <div>
                    <span className="text-primary font-medium">Reputation:</span>
                    <span className="ml-2 text-muted-foreground">{result.urlAnalysis.reputation}</span>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Badge
                    className={
                      result.urlAnalysis.isPhishing ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                    }
                  >
                    {result.urlAnalysis.isPhishing ? "PHISHING DETECTED" : "NO PHISHING"}
                  </Badge>
                  <Badge
                    className={
                      result.urlAnalysis.isMalicious ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                    }
                  >
                    {result.urlAnalysis.isMalicious ? "MALICIOUS" : "CLEAN"}
                  </Badge>
                </div>

                {result.urlAnalysis.redirects.length > 0 && (
                  <div>
                    <span className="text-primary font-medium">Redirects:</span>
                    <ul className="ml-4 mt-1 space-y-1">
                      {result.urlAnalysis.redirects.map((redirect, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">
                          • {redirect}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Security Recommendations */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center text-success">
                <Shield className="h-5 w-5 mr-2" />
                Security Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {result.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
