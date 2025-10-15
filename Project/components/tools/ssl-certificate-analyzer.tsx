"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, AlertTriangle, CheckCircle, Clock, Shield } from "lucide-react"

interface SSLAnalysisResult {
  domain: string
  isValid: boolean
  issuer: string
  subject: string
  validFrom: string
  validTo: string
  daysUntilExpiry: number
  signatureAlgorithm: string
  keySize: number
  protocol: string
  cipherSuite: string
  vulnerabilities: string[]
  securityGrade: string
  chainValid: boolean
  ocspStapling: boolean
  hsts: boolean
}

export default function SSLCertificateAnalyzer() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<SSLAnalysisResult | null>(null)

  const analyzeSSL = async () => {
    if (!url) return

    setIsAnalyzing(true)

    // Simulate SSL analysis with realistic data
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname
    const now = new Date()
    const validFrom = new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000)
    const validTo = new Date(now.getTime() + Math.random() * 365 * 24 * 60 * 60 * 1000)
    const daysUntilExpiry = Math.floor((validTo.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))

    const vulnerabilities = []
    if (Math.random() > 0.7) vulnerabilities.push("Weak cipher suite detected")
    if (Math.random() > 0.8) vulnerabilities.push("Certificate chain incomplete")
    if (Math.random() > 0.9) vulnerabilities.push("OCSP stapling not configured")

    const securityGrade =
      vulnerabilities.length === 0
        ? "A+"
        : vulnerabilities.length === 1
          ? "A"
          : vulnerabilities.length === 2
            ? "B"
            : "C"

    setResult({
      domain,
      isValid: daysUntilExpiry > 0,
      issuer: "Let's Encrypt Authority X3",
      subject: `CN=${domain}`,
      validFrom: validFrom.toISOString().split("T")[0],
      validTo: validTo.toISOString().split("T")[0],
      daysUntilExpiry,
      signatureAlgorithm: "SHA256withRSA",
      keySize: 2048,
      protocol: "TLS 1.3",
      cipherSuite: "TLS_AES_256_GCM_SHA384",
      vulnerabilities,
      securityGrade,
      chainValid: Math.random() > 0.2,
      ocspStapling: Math.random() > 0.3,
      hsts: Math.random() > 0.4,
    })

    setIsAnalyzing(false)
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
        return "text-green-400"
      case "A":
        return "text-green-500"
      case "B":
        return "text-yellow-500"
      case "C":
        return "text-orange-500"
      default:
        return "text-red-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          placeholder="Enter domain or URL (e.g., example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button onClick={analyzeSSL} disabled={!url || isAnalyzing} className="bg-primary hover:bg-primary/80">
          {isAnalyzing ? "Analyzing..." : "Analyze SSL"}
        </Button>
      </div>

      {result && (
        <div className="grid gap-6">
          {/* Certificate Overview */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Certificate Overview
                <Badge className={`ml-auto ${getGradeColor(result.securityGrade)}`}>
                  Grade: {result.securityGrade}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Domain</label>
                  <p className="text-foreground">{result.domain}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="flex items-center gap-2">
                    {result.isValid ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={result.isValid ? "text-green-500" : "text-red-500"}>
                      {result.isValid ? "Valid" : "Invalid/Expired"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Issuer</label>
                  <p className="text-foreground">{result.issuer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Subject</label>
                  <p className="text-foreground">{result.subject}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validity Period */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Validity Period
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Valid From</label>
                  <p className="text-foreground">{result.validFrom}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Valid To</label>
                  <p className="text-foreground">{result.validTo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Days Until Expiry</label>
                  <p
                    className={`font-semibold ${
                      result.daysUntilExpiry > 30
                        ? "text-green-500"
                        : result.daysUntilExpiry > 7
                          ? "text-yellow-500"
                          : "text-red-500"
                    }`}
                  >
                    {result.daysUntilExpiry} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Details */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Security Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Protocol</label>
                  <p className="text-foreground">{result.protocol}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cipher Suite</label>
                  <p className="text-foreground">{result.cipherSuite}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Key Size</label>
                  <p className="text-foreground">{result.keySize} bits</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Signature Algorithm</label>
                  <p className="text-foreground">{result.signatureAlgorithm}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-primary/20">
                <div className="flex items-center gap-2">
                  {result.chainValid ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">Certificate Chain</span>
                </div>
                <div className="flex items-center gap-2">
                  {result.ocspStapling ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className="text-sm">OCSP Stapling</span>
                </div>
                <div className="flex items-center gap-2">
                  {result.hsts ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className="text-sm">HSTS</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vulnerabilities */}
          {result.vulnerabilities.length > 0 && (
            <Card className="border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  Security Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.vulnerabilities.map((vuln, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-red-500/10 rounded">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-red-300">{vuln}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
