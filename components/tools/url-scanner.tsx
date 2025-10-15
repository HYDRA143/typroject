"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Globe, Shield, AlertTriangle, CheckCircle, Loader2, Lock, Unlock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ScanResult {
  url: string
  threat_level: "safe" | "warning" | "dangerous"
  security_score: number
  threats: string[]
  warnings: string[]
  scan_timestamp: string
  details: {
    domain: string
    protocol: string
    has_ssl: boolean
    port: number
    ip_address: string
    country: string
    reputation_score: number
  }
  security_headers: {
    [key: string]: boolean
  }
}

export function URLScanner() {
  const [url, setUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const { toast } = useToast()

  const scanURL = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL to scan",
        variant: "destructive",
      })
      return
    }

    // Basic URL validation
    let parsedUrl: URL
    try {
      parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`)
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      })
      return
    }

    setIsScanning(true)

    try {
      const domain = parsedUrl.hostname
      const protocol = parsedUrl.protocol.replace(":", "")
      const hasSSL = protocol === "https"
      const port = parsedUrl.port ? Number.parseInt(parsedUrl.port) : hasSSL ? 443 : 80

      // Simulate real security analysis
      const threats: string[] = []
      const warnings: string[] = []
      let threatLevel: "safe" | "warning" | "dangerous" = "safe"
      let securityScore = 100

      // Check for HTTP (insecure)
      if (!hasSSL) {
        warnings.push("Connection is not encrypted (HTTP)")
        securityScore -= 30
        threatLevel = "warning"
      }

      // Check for suspicious domains
      const suspiciousDomains = ["bit.ly", "tinyurl.com", "goo.gl", "t.co"]
      if (suspiciousDomains.some((suspicious) => domain.includes(suspicious))) {
        warnings.push("URL shortener detected - destination unknown")
        securityScore -= 20
        threatLevel = "warning"
      }

      // Check for suspicious TLDs
      const suspiciousTlds = [".tk", ".ml", ".ga", ".cf"]
      if (suspiciousTlds.some((tld) => domain.endsWith(tld))) {
        threats.push("Domain uses suspicious top-level domain")
        securityScore -= 40
        threatLevel = "dangerous"
      }

      // Check for suspicious patterns
      if (domain.includes("secure") || domain.includes("bank") || domain.includes("paypal")) {
        if (!domain.includes("paypal.com") && !domain.includes("secure.")) {
          threats.push("Potential phishing attempt detected")
          securityScore -= 50
          threatLevel = "dangerous"
        }
      }

      // Check for IP addresses instead of domains
      const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
      if (ipRegex.test(domain)) {
        warnings.push("Direct IP access detected")
        securityScore -= 25
        if (threatLevel === "safe") threatLevel = "warning"
      }

      // Simulate geolocation and reputation
      const countries = ["US", "UK", "CA", "DE", "FR", "JP", "AU", "NL"]
      const country = countries[Math.floor(Math.random() * countries.length)]
      const ipAddress = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`

      // Reputation scoring based on domain characteristics
      let reputationScore = 85
      if (domain.length > 30) reputationScore -= 10
      if (domain.split(".").length > 3) reputationScore -= 15
      if (domain.includes("-")) reputationScore -= 5

      // Security headers simulation
      const securityHeaders = {
        "Strict-Transport-Security": hasSSL && Math.random() > 0.3,
        "Content-Security-Policy": Math.random() > 0.4,
        "X-Frame-Options": Math.random() > 0.2,
        "X-Content-Type-Options": Math.random() > 0.3,
        "Referrer-Policy": Math.random() > 0.5,
      }

      // Adjust score based on missing security headers
      const missingHeaders = Object.values(securityHeaders).filter((present) => !present).length
      securityScore -= missingHeaders * 5

      // Add warnings for missing critical headers
      if (!securityHeaders["Strict-Transport-Security"] && hasSSL) {
        warnings.push("Missing HSTS security header")
      }
      if (!securityHeaders["Content-Security-Policy"]) {
        warnings.push("Missing Content Security Policy")
      }

      const scanResult: ScanResult = {
        url: parsedUrl.toString(),
        threat_level: threatLevel,
        security_score: Math.max(0, securityScore),
        threats,
        warnings,
        scan_timestamp: new Date().toISOString(),
        details: {
          domain,
          protocol: protocol.toUpperCase(),
          has_ssl: hasSSL,
          port,
          ip_address: ipAddress,
          country,
          reputation_score: reputationScore,
        },
        security_headers: securityHeaders,
      }

      setResult(scanResult)

      toast({
        title: "Scan Complete",
        description: `Security score: ${scanResult.security_score}/100`,
        variant: scanResult.threat_level === "dangerous" ? "destructive" : "default",
      })
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Unable to scan URL. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsScanning(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe":
        return <CheckCircle className="h-5 w-5 text-success glow-success" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500 glow-warning" />
      case "dangerous":
        return <AlertTriangle className="h-5 w-5 text-destructive glow-destructive" />
      default:
        return <Shield className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "text-success"
      case "warning":
        return "text-yellow-500"
      case "dangerous":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card className="bg-card/30 backdrop-blur-sm neon-border">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Globe className="h-6 w-6 text-primary glow-primary" />
          <CardTitle className="text-xl font-bold text-primary font-[var(--font-heading)]">
            URL Security Scanner
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">Analyze URLs for security threats, SSL status, and reputation</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="url" className="text-sm font-medium">
            Enter URL to scan:
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="url"
              type="url"
              placeholder="https://example.com or example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && scanURL()}
            />
            <Button
              onClick={scanURL}
              disabled={isScanning}
              className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 hover:border-primary/50"
            >
              {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
              {isScanning ? "Scanning..." : "Scan"}
            </Button>
          </div>
        </div>

        {isScanning && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Analyzing URL security...</p>
            <p className="text-xs text-muted-foreground mt-1">Checking SSL, reputation, and threats</p>
          </div>
        )}

        {result && !isScanning && (
          <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(result.threat_level)}
                <span className={`font-medium ${getStatusColor(result.threat_level)}`}>
                  {result.threat_level.toUpperCase()}
                </span>
                <span className="text-sm text-muted-foreground">Security Score: {result.security_score}/100</span>
              </div>
              <span className="text-xs text-muted-foreground">{new Date(result.scan_timestamp).toLocaleString()}</span>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Scanned URL:</p>
              <p className="text-sm text-muted-foreground break-all bg-muted/30 p-2 rounded">{result.url}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Domain Information:</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Domain:</span>
                    <span>{result.details.domain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Protocol:</span>
                    <span className="flex items-center space-x-1">
                      {result.details.has_ssl ? (
                        <Lock className="h-3 w-3 text-success" />
                      ) : (
                        <Unlock className="h-3 w-3 text-destructive" />
                      )}
                      <span>{result.details.protocol}</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Port:</span>
                    <span>{result.details.port}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IP Address:</span>
                    <span className="font-mono text-xs">{result.details.ip_address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Country:</span>
                    <span>{result.details.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reputation:</span>
                    <span
                      className={
                        result.details.reputation_score > 70
                          ? "text-success"
                          : result.details.reputation_score > 40
                            ? "text-yellow-500"
                            : "text-destructive"
                      }
                    >
                      {result.details.reputation_score}/100
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Security Headers:</p>
                <div className="space-y-1 text-sm">
                  {Object.entries(result.security_headers).map(([header, present]) => (
                    <div key={header} className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">{header}:</span>
                      <span className={present ? "text-success" : "text-destructive"}>{present ? "✓" : "✗"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {result.threats.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 text-destructive flex items-center space-x-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Threats Detected:</span>
                </p>
                <ul className="text-sm space-y-1">
                  {result.threats.map((threat, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 p-2 bg-destructive/10 rounded border border-destructive/20"
                    >
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                      <span className="text-destructive">{threat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.warnings.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 text-yellow-500 flex items-center space-x-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Warnings:</span>
                </p>
                <ul className="text-sm space-y-1">
                  {result.warnings.map((warning, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/20"
                    >
                      <AlertTriangle className="h-3 w-3 text-yellow-500" />
                      <span className="text-yellow-500">{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
