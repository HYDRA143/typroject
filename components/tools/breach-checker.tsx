"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Search, Database, Eye } from "lucide-react"

interface BreachResult {
  email: string
  breaches: Array<{
    name: string
    domain: string
    breachDate: string
    addedDate: string
    modifiedDate: string
    pwnCount: number
    description: string
    dataClasses: string[]
    isVerified: boolean
    isFabricated: boolean
    isSensitive: boolean
    isRetired: boolean
    isSpamList: boolean
    logoPath: string
  }>
  pastes: Array<{
    source: string
    id: string
    title: string
    date: string
    emailCount: number
  }>
  riskScore: number
  threatLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
}

export function BreachChecker() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BreachResult | null>(null)
  const [error, setError] = useState("")

  const checkBreach = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      // Real breach checking using Have I Been Pwned API
      const response = await fetch(`/api/check-breach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error("Failed to check breach status")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError("Failed to check breach status. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "LOW":
        return "text-green-400 border-green-400"
      case "MEDIUM":
        return "text-yellow-400 border-yellow-400"
      case "HIGH":
        return "text-orange-400 border-orange-400"
      case "CRITICAL":
        return "text-red-400 border-red-400"
      default:
        return "text-gray-400 border-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Database className="h-5 w-5 mr-2" />
            Data Breach Lookup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter email address to check"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              type="email"
            />
            <Button onClick={checkBreach} disabled={loading} className="cyber-button">
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Scanning...
                </div>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Check Breaches
                </>
              )}
            </Button>
          </div>

          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">{error}</div>}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {/* Risk Assessment */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center text-primary">
                  <Shield className="h-5 w-5 mr-2" />
                  Risk Assessment
                </span>
                <Badge className={`${getRiskColor(result.threatLevel)} bg-transparent`}>
                  {result.threatLevel} RISK
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{result.riskScore}/100</div>
                  <div className="text-sm text-muted-foreground">Risk Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{result.breaches.length}</div>
                  <div className="text-sm text-muted-foreground">Known Breaches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{result.pastes.length}</div>
                  <div className="text-sm text-muted-foreground">Paste Exposures</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Breach Details */}
          {result.breaches.length > 0 && (
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="flex items-center text-red-400">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Confirmed Data Breaches
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.breaches.map((breach, index) => (
                  <div key={index} className="border border-red-500/20 rounded-lg p-4 bg-red-500/5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-red-400">{breach.name}</h4>
                      <div className="flex space-x-2">
                        {breach.isVerified && <Badge className="bg-green-500/20 text-green-400">Verified</Badge>}
                        {breach.isSensitive && <Badge className="bg-red-500/20 text-red-400">Sensitive</Badge>}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{breach.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-primary">Breach Date:</span>{" "}
                        {new Date(breach.breachDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="text-primary">Affected Users:</span> {breach.pwnCount.toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-primary text-sm">Compromised Data:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {breach.dataClasses.map((dataClass, idx) => (
                          <Badge key={idx} className="bg-yellow-500/20 text-yellow-400 text-xs">
                            {dataClass}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Paste Exposures */}
          {result.pastes.length > 0 && (
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-400">
                  <Eye className="h-5 w-5 mr-2" />
                  Paste Exposures
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.pastes.map((paste, index) => (
                  <div key={index} className="border border-yellow-500/20 rounded-lg p-3 bg-yellow-500/5">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-yellow-400">{paste.source}</span>
                      <span className="text-sm text-muted-foreground">{new Date(paste.date).toLocaleDateString()}</span>
                    </div>
                    {paste.title && <p className="text-sm text-muted-foreground mt-1">{paste.title}</p>}
                  </div>
                ))}
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
                {result.breaches.length > 0 && (
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Immediately change passwords for all affected accounts</span>
                  </li>
                )}
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Enable two-factor authentication on all accounts</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Use unique, strong passwords for each account</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Monitor your accounts regularly for suspicious activity</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
