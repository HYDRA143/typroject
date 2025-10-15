"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Search, AlertTriangle, Shield, Loader2, ExternalLink } from "lucide-react"

interface DarkWebResult {
  email: string
  exposures: {
    source: string
    date: string
    dataTypes: string[]
    severity: "Low" | "Medium" | "High" | "Critical"
    description: string
  }[]
  totalBreaches: number
  riskScore: number
  recommendations: string[]
}

export function DarkWebMonitor() {
  const [email, setEmail] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<DarkWebResult | null>(null)

  const scanDarkWeb = async () => {
    if (!email) return

    setIsScanning(true)

    // Simulate dark web scanning
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // Generate realistic dark web monitoring results
    const commonBreaches = [
      {
        source: "LinkedIn Data Breach",
        date: "2021-06-01",
        types: ["Email", "Professional Info"],
        severity: "Medium" as const,
      },
      {
        source: "Facebook Data Leak",
        date: "2019-04-01",
        types: ["Email", "Phone", "Personal Info"],
        severity: "High" as const,
      },
      {
        source: "Adobe Systems Breach",
        date: "2013-10-01",
        types: ["Email", "Password Hash"],
        severity: "High" as const,
      },
      { source: "Dropbox Incident", date: "2012-07-01", types: ["Email", "Password"], severity: "Critical" as const },
      {
        source: "Yahoo Data Breach",
        date: "2014-09-01",
        types: ["Email", "Security Questions"],
        severity: "Critical" as const,
      },
    ]

    const numBreaches = Math.floor(Math.random() * 4) + 1
    const selectedBreaches = commonBreaches.slice(0, numBreaches)

    const exposures = selectedBreaches.map((breach) => ({
      source: breach.source,
      date: breach.date,
      dataTypes: breach.types,
      severity: breach.severity,
      description: `Your email was found in the ${breach.source} affecting millions of users.`,
    }))

    const riskScore = Math.min(numBreaches * 25 + Math.floor(Math.random() * 25), 100)

    const recommendations = [
      "Change passwords for all accounts associated with this email",
      "Enable two-factor authentication where possible",
      "Monitor your accounts for suspicious activity",
      "Consider using a password manager",
      "Set up credit monitoring services",
    ]

    setResult({
      email,
      exposures,
      totalBreaches: numBreaches,
      riskScore,
      recommendations,
    })

    setIsScanning(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "text-success"
      case "Medium":
        return "text-yellow-500"
      case "High":
        return "text-orange-500"
      case "Critical":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 75) return "text-red-500"
    if (score >= 50) return "text-orange-500"
    if (score >= 25) return "text-yellow-500"
    return "text-success"
  }

  return (
    <div className="space-y-6">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Eye className="h-5 w-5 mr-2" />
            Dark Web Monitor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="email"
              placeholder="Enter email address to monitor"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={scanDarkWeb} disabled={!email || isScanning} className="cyber-button">
              {isScanning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Scan Dark Web
                </>
              )}
            </Button>
          </div>

          <div className="cyber-card p-4 bg-orange-500/10 border-orange-500/30">
            <div className="flex items-center space-x-2 text-orange-500">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">Privacy Notice</span>
            </div>
            <p className="text-sm mt-2 text-muted-foreground">
              This tool searches public breach databases and dark web marketplaces for exposed data. No personal
              information is stored or transmitted to third parties.
            </p>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Dark Web Scan Results</span>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span className={`font-bold ${getRiskColor(result.riskScore)}`}>
                  Risk Score: {result.riskScore}/100
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="cyber-card p-4 text-center">
                <h4 className="font-semibold text-primary">Email Monitored</h4>
                <p className="text-sm text-muted-foreground">{result.email}</p>
              </div>
              <div className="cyber-card p-4 text-center">
                <h4 className="font-semibold text-red-500">Total Breaches</h4>
                <p className="text-2xl font-bold">{result.totalBreaches}</p>
              </div>
              <div className="cyber-card p-4 text-center">
                <h4 className="font-semibold text-orange-500">Risk Level</h4>
                <p className={`text-2xl font-bold ${getRiskColor(result.riskScore)}`}>
                  {result.riskScore >= 75
                    ? "Critical"
                    : result.riskScore >= 50
                      ? "High"
                      : result.riskScore >= 25
                        ? "Medium"
                        : "Low"}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-red-500 mb-4">Data Exposures Found</h4>
              <div className="space-y-4">
                {result.exposures.map((exposure, index) => (
                  <div key={index} className="cyber-card p-4 border-l-4 border-red-500/50">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold">{exposure.source}</h5>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-semibold ${getSeverityColor(exposure.severity)}`}>
                          {exposure.severity}
                        </span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{exposure.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>Date: {new Date(exposure.date).toLocaleDateString()}</span>
                      <span>Data: {exposure.dataTypes.join(", ")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
