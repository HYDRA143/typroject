"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Shield, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react"

interface PhishingResult {
  riskLevel: "Safe" | "Low" | "Medium" | "High" | "Critical"
  phishingScore: number
  indicators: {
    type: string
    description: string
    severity: "Low" | "Medium" | "High"
  }[]
  senderAnalysis: {
    domain: string
    reputation: string
    spoofed: boolean
  }
  recommendations: string[]
}

export function EmailPhishingDetector() {
  const [emailContent, setEmailContent] = useState("")
  const [senderEmail, setSenderEmail] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<PhishingResult | null>(null)

  const analyzeEmail = async () => {
    if (!emailContent && !senderEmail) return

    setIsAnalyzing(true)

    // Simulate email analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Real phishing detection logic
    const indicators: PhishingResult["indicators"] = []
    let phishingScore = 0

    // Check for suspicious patterns
    const suspiciousWords = [
      "urgent",
      "verify",
      "suspended",
      "click here",
      "limited time",
      "act now",
      "congratulations",
      "winner",
    ]
    const foundSuspiciousWords = suspiciousWords.filter((word) =>
      emailContent.toLowerCase().includes(word.toLowerCase()),
    )

    if (foundSuspiciousWords.length > 0) {
      indicators.push({
        type: "Suspicious Language",
        description: `Contains urgency words: ${foundSuspiciousWords.join(", ")}`,
        severity: "Medium",
      })
      phishingScore += foundSuspiciousWords.length * 15
    }

    // Check for suspicious links
    const urlPattern = /https?:\/\/[^\s]+/g
    const urls = emailContent.match(urlPattern) || []
    const suspiciousDomains = urls.filter(
      (url) =>
        url.includes("bit.ly") ||
        url.includes("tinyurl") ||
        url.includes("t.co") ||
        url.includes("secure-") ||
        url.includes("-verification"),
    )

    if (suspiciousDomains.length > 0) {
      indicators.push({
        type: "Suspicious Links",
        description: `Contains shortened or suspicious URLs: ${suspiciousDomains.length} found`,
        severity: "High",
      })
      phishingScore += suspiciousDomains.length * 25
    }

    // Analyze sender domain
    const senderAnalysis = {
      domain: "unknown",
      reputation: "Unknown",
      spoofed: false,
    }

    if (senderEmail) {
      const domain = senderEmail.split("@")[1]
      senderAnalysis.domain = domain

      // Check for domain spoofing
      const legitimateDomains = ["gmail.com", "outlook.com", "yahoo.com", "apple.com", "microsoft.com", "google.com"]
      const similarDomains = ["gmai1.com", "out1ook.com", "yah00.com", "app1e.com", "microsft.com", "g00gle.com"]

      if (similarDomains.includes(domain)) {
        senderAnalysis.spoofed = true
        senderAnalysis.reputation = "Suspicious"
        indicators.push({
          type: "Domain Spoofing",
          description: `Sender domain appears to mimic legitimate service: ${domain}`,
          severity: "High",
        })
        phishingScore += 40
      } else if (legitimateDomains.includes(domain)) {
        senderAnalysis.reputation = "Good"
      } else {
        senderAnalysis.reputation = "Unknown"
        phishingScore += 10
      }
    }

    // Check for personal information requests
    const personalInfoWords = ["ssn", "social security", "password", "pin", "credit card", "bank account"]
    const foundPersonalWords = personalInfoWords.filter((word) =>
      emailContent.toLowerCase().includes(word.toLowerCase()),
    )

    if (foundPersonalWords.length > 0) {
      indicators.push({
        type: "Personal Information Request",
        description: `Requests sensitive information: ${foundPersonalWords.join(", ")}`,
        severity: "High",
      })
      phishingScore += foundPersonalWords.length * 20
    }

    // Determine risk level
    let riskLevel: PhishingResult["riskLevel"] = "Safe"
    if (phishingScore >= 80) riskLevel = "Critical"
    else if (phishingScore >= 60) riskLevel = "High"
    else if (phishingScore >= 40) riskLevel = "Medium"
    else if (phishingScore >= 20) riskLevel = "Low"

    const recommendations = [
      "Do not click on any links in suspicious emails",
      "Verify sender identity through alternative communication",
      "Never provide personal information via email",
      "Report phishing attempts to your IT department",
      "Use email security filters and anti-phishing tools",
    ]

    setResult({
      riskLevel,
      phishingScore: Math.min(phishingScore, 100),
      indicators,
      senderAnalysis,
      recommendations,
    })

    setIsAnalyzing(false)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Safe":
        return "text-success"
      case "Low":
        return "text-yellow-500"
      case "Medium":
        return "text-orange-500"
      case "High":
        return "text-red-500"
      case "Critical":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "Safe":
        return <CheckCircle className="h-5 w-5 text-success" />
      case "Low":
      case "Medium":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "High":
      case "Critical":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Mail className="h-5 w-5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "text-yellow-500"
      case "Medium":
        return "text-orange-500"
      case "High":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Mail className="h-5 w-5 mr-2" />
            Email Phishing Detector
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Sender Email (Optional)</label>
            <input
              type="email"
              placeholder="sender@example.com"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              className="w-full p-3 bg-background border border-primary/30 rounded-lg focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email Content</label>
            <Textarea
              placeholder="Paste the email content here for analysis..."
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="min-h-32 bg-background border border-primary/30 focus:border-primary"
            />
          </div>

          <Button
            onClick={analyzeEmail}
            disabled={(!emailContent && !senderEmail) || isAnalyzing}
            className="w-full cyber-button"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Email...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Analyze for Phishing
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Phishing Analysis Results</span>
              <div className="flex items-center space-x-2">
                {getRiskIcon(result.riskLevel)}
                <span className={getRiskColor(result.riskLevel)}>{result.riskLevel} Risk</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="cyber-card p-4 text-center">
                <h4 className="font-semibold text-primary">Phishing Score</h4>
                <p className={`text-2xl font-bold ${getRiskColor(result.riskLevel)}`}>{result.phishingScore}/100</p>
              </div>
              <div className="cyber-card p-4 text-center">
                <h4 className="font-semibold text-orange-500">Indicators Found</h4>
                <p className="text-2xl font-bold">{result.indicators.length}</p>
              </div>
              <div className="cyber-card p-4 text-center">
                <h4 className="font-semibold text-success">Sender Domain</h4>
                <p className="text-sm">{result.senderAnalysis.domain}</p>
                <p className={`text-sm ${result.senderAnalysis.spoofed ? "text-red-500" : "text-success"}`}>
                  {result.senderAnalysis.reputation}
                </p>
              </div>
            </div>

            {result.indicators.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-500 mb-4">Phishing Indicators</h4>
                <div className="space-y-3">
                  {result.indicators.map((indicator, index) => (
                    <div key={index} className="cyber-card p-4 border-l-4 border-red-500/50">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold">{indicator.type}</h5>
                        <span className={`text-sm font-semibold ${getSeverityColor(indicator.severity)}`}>
                          {indicator.severity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{indicator.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-success mb-4">Security Recommendations</h4>
              <div className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-success flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
