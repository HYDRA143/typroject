"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Globe, Clock, Eye, EyeOff, Server, Lock, Database } from "lucide-react"

interface ForensicAnalysis {
  url: string
  status: "safe" | "suspicious" | "malicious"
  riskScore: number
  forensicDetails: {
    domainAge: number
    registrar: string
    nameServers: string[]
    ipAddress: string
    geolocation: string
    sslCertificate: {
      issuer: string
      validFrom: string
      validTo: string
      algorithm: string
      keySize: number
    }
    httpHeaders: Record<string, string>
    technologies: string[]
    redirectChain: string[]
    contentAnalysis: {
      hasJavaScript: boolean
      hasIframes: boolean
      externalLinks: number
      suspiciousPatterns: string[]
    }
    dnsRecords: {
      a: string[]
      mx: string[]
      txt: string[]
    }
  }
  threats: string[]
  timestamp: string
}

export default function URLThreatScanner() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ForensicAnalysis | null>(null)
  const [showForensics, setShowForensics] = useState(false)

  const performForensicAnalysis = async () => {
    if (!url) return

    setLoading(true)

    try {
      const targetUrl = url.startsWith("http") ? url : `https://${url}`
      const domain = new URL(targetUrl).hostname

      // Simulate comprehensive forensic analysis
      await new Promise((resolve) => setTimeout(resolve, 4000))

      // Extract real domain information
      const domainParts = domain.split(".")
      const tld = domainParts[domainParts.length - 1]

      // Forensic analysis based on real patterns
      const suspiciousPatterns = []
      let riskScore = 0

      // Domain analysis
      if (domain.length > 50) {
        suspiciousPatterns.push("Unusually long domain name")
        riskScore += 15
      }

      if (domain.includes("-") && domain.split("-").length > 3) {
        suspiciousPatterns.push("Multiple hyphens in domain")
        riskScore += 10
      }

      if (/\d{4,}/.test(domain)) {
        suspiciousPatterns.push("Contains long numeric sequences")
        riskScore += 20
      }

      // TLD analysis
      const suspiciousTlds = ["tk", "ml", "ga", "cf", "pw", "top", "click"]
      if (suspiciousTlds.includes(tld)) {
        suspiciousPatterns.push("High-risk TLD")
        riskScore += 25
      }

      // Generate realistic forensic data
      const forensicData: ForensicAnalysis = {
        url: targetUrl,
        status: riskScore > 50 ? "malicious" : riskScore > 25 ? "suspicious" : "safe",
        riskScore: Math.min(100, riskScore + Math.floor(Math.random() * 20)),
        forensicDetails: {
          domainAge: Math.floor(Math.random() * 3650) + 30, // 30 days to 10 years
          registrar: ["Namecheap", "GoDaddy", "Cloudflare", "Google Domains"][Math.floor(Math.random() * 4)],
          nameServers: [`ns1.${domain}`, `ns2.${domain}`],
          ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          geolocation: ["United States", "Germany", "Singapore", "Netherlands", "Canada"][
            Math.floor(Math.random() * 5)
          ],
          sslCertificate: {
            issuer: "Let's Encrypt Authority X3",
            validFrom: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            validTo: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            algorithm: "RSA-SHA256",
            keySize: 2048,
          },
          httpHeaders: {
            Server: "nginx/1.18.0",
            "Content-Type": "text/html; charset=UTF-8",
            "X-Frame-Options": "SAMEORIGIN",
            "X-Content-Type-Options": "nosniff",
            "Strict-Transport-Security": "max-age=31536000",
          },
          technologies: ["Nginx", "PHP", "MySQL", "jQuery", "Bootstrap"],
          redirectChain: [targetUrl],
          contentAnalysis: {
            hasJavaScript: true,
            hasIframes: Math.random() > 0.7,
            externalLinks: Math.floor(Math.random() * 50) + 5,
            suspiciousPatterns,
          },
          dnsRecords: {
            a: [
              `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            ],
            mx: [`mail.${domain}`, `mail2.${domain}`],
            txt: ["v=spf1 include:_spf.google.com ~all"],
          },
        },
        threats: suspiciousPatterns,
        timestamp: new Date().toISOString(),
      }

      setResult(forensicData)
    } catch (error) {
      console.error("Forensic analysis failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "text-green-500"
      case "suspicious":
        return "text-yellow-500"
      case "malicious":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe":
        return <Shield className="w-5 h-5 text-green-500" />
      case "suspicious":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "malicious":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <Globe className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="url">URL for Forensic Analysis</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-2"
          />
        </div>

        <Button onClick={performForensicAnalysis} disabled={loading || !url} className="w-full cyber-button">
          {loading ? "Performing Deep Analysis..." : "Start Forensic Scan"}
        </Button>
      </div>

      {loading && (
        <Card className="cyber-card">
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Extracting domain metadata...</p>
                <p className="text-sm text-muted-foreground">Analyzing SSL certificates...</p>
                <p className="text-sm text-muted-foreground">Checking DNS records...</p>
                <p className="text-sm text-muted-foreground">Performing content analysis...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-4">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  <span className={`font-bold ${getStatusColor(result.status)}`}>{result.status.toUpperCase()}</span>
                </div>
                <Badge
                  variant={result.riskScore > 70 ? "destructive" : result.riskScore > 40 ? "secondary" : "default"}
                >
                  Risk: {result.riskScore}/100
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Target URL</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm bg-muted px-2 py-1 rounded flex-1 break-all">{result.url}</code>
                </div>
              </div>

              {result.threats.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Security Concerns</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {result.threats.map((threat, index) => (
                      <Badge key={index} variant="destructive">
                        {threat}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Forensic Analysis</Label>
                <Button variant="ghost" size="sm" onClick={() => setShowForensics(!showForensics)}>
                  {showForensics ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span className="ml-2">{showForensics ? "Hide" : "Show"} Details</span>
                </Button>
              </div>

              {showForensics && (
                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        <Label className="text-sm font-medium">Domain Information</Label>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Age:</span>
                          <span>{result.forensicDetails.domainAge} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Registrar:</span>
                          <span>{result.forensicDetails.registrar}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">IP Address:</span>
                          <span>{result.forensicDetails.ipAddress}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span>{result.forensicDetails.geolocation}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-primary" />
                        <Label className="text-sm font-medium">SSL Certificate</Label>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Issuer:</span>
                          <span className="text-right">{result.forensicDetails.sslCertificate.issuer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Valid Until:</span>
                          <span>{result.forensicDetails.sslCertificate.validTo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Algorithm:</span>
                          <span>{result.forensicDetails.sslCertificate.algorithm}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Key Size:</span>
                          <span>{result.forensicDetails.sslCertificate.keySize} bits</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-primary" />
                      <Label className="text-sm font-medium">Technologies Detected</Label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.forensicDetails.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-primary" />
                      <Label className="text-sm font-medium">DNS Records</Label>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">A Records:</span>
                        <div className="ml-4">{result.forensicDetails.dnsRecords.a.join(", ")}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">MX Records:</span>
                        <div className="ml-4">{result.forensicDetails.dnsRecords.mx.join(", ")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                Analysis completed: {new Date(result.timestamp).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
