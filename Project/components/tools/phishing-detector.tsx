"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Shield, Search, Mail, Link, FileText } from "lucide-react"

interface PhishingResult {
  type: "url" | "email" | "content"
  input: string
  isPhishing: boolean
  riskScore: number
  threatLevel: "SAFE" | "SUSPICIOUS" | "DANGEROUS" | "MALICIOUS"
  indicators: Array<{
    type: string
    description: string
    severity: "low" | "medium" | "high" | "critical"
  }>
  analysis: {
    domain?: string
    reputation?: string
    redirects?: string[]
    certificates?: any
    headers?: any
    content?: any
  }
  recommendations: string[]
}

export function PhishingDetector() {
  const [activeTab, setActiveTab] = useState("url")
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PhishingResult | null>(null)
  const [error, setError] = useState("")

  const analyzeContent = async (type: "url" | "email" | "content") => {
    if (!input.trim()) {
      setError(`Please enter ${type === "url" ? "a URL" : type === "email" ? "email content" : "content"} to analyze`)
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/analyze-phishing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, input }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze content")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError("Failed to analyze content. Please try again.")
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
            <Shield className="h-5 w-5 mr-2" />
            Phishing Detection Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="url" className="flex items-center">
                <Link className="h-4 w-4 mr-2" />
                URL Analysis
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email Analysis
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Content Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter URL to analyze (e.g., https://example.com)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={() => analyzeContent("url")} disabled={loading} className="cyber-button">
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                      Analyzing...
                    </div>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Analyze URL
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <Textarea
                placeholder="Paste email content here (headers, body, links)..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-32"
              />
              <Button onClick={() => analyzeContent("email")} disabled={loading} className="cyber-button w-full">
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Analyzing Email...
                  </div>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Analyze Email
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <Textarea
                placeholder="Paste suspicious content here (messages, forms, etc.)..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-32"
              />
              <Button onClick={() => analyzeContent("content")} disabled={loading} className="cyber-button w-full">
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Analyzing Content...
                  </div>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Analyze Content
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 mt-4">{error}</div>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {/* Threat Assessment */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center text-primary">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Threat Assessment
                </span>
                <Badge className={getThreatColor(result.threatLevel)}>{result.threatLevel}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{result.riskScore}/100</div>
                  <div className="text-sm text-muted-foreground">Risk Score</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${result.isPhishing ? "text-red-400" : "text-green-400"}`}>
                    {result.isPhishing ? "PHISHING" : "LEGITIMATE"}
                  </div>
                  <div className="text-sm text-muted-foreground">Classification</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Threat Indicators */}
          {result.indicators.length > 0 && (
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-400">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Threat Indicators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.indicators.map((indicator, index) => (
                  <div key={index} className="border border-yellow-500/20 rounded-lg p-3 bg-yellow-500/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-yellow-400">{indicator.type}</span>
                      <Badge className={getSeverityColor(indicator.severity)}>{indicator.severity.toUpperCase()}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{indicator.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Technical Analysis */}
          {result.analysis && (
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Search className="h-5 w-5 mr-2" />
                  Technical Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.analysis.domain && (
                  <div>
                    <span className="text-primary font-medium">Domain:</span>
                    <span className="ml-2 text-muted-foreground">{result.analysis.domain}</span>
                  </div>
                )}
                {result.analysis.reputation && (
                  <div>
                    <span className="text-primary font-medium">Reputation:</span>
                    <span className="ml-2 text-muted-foreground">{result.analysis.reputation}</span>
                  </div>
                )}
                {result.analysis.redirects && result.analysis.redirects.length > 0 && (
                  <div>
                    <span className="text-primary font-medium">Redirects:</span>
                    <ul className="ml-4 mt-1 space-y-1">
                      {result.analysis.redirects.map((redirect, idx) => (
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
