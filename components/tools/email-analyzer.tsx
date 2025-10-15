"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Shield, AlertTriangle } from "lucide-react"

export function EmailAnalyzer() {
  const [emailHeaders, setEmailHeaders] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!emailHeaders.trim()) return

    setAnalyzing(true)
    // Simulate analysis
    setTimeout(() => {
      setResults({
        spfStatus: Math.random() > 0.3 ? "PASS" : "FAIL",
        dkimStatus: Math.random() > 0.4 ? "PASS" : "FAIL",
        dmarcStatus: Math.random() > 0.5 ? "PASS" : "FAIL",
        suspiciousElements: Math.random() > 0.6 ? [] : ["Suspicious sender domain", "Missing authentication"],
        riskLevel: Math.random() > 0.7 ? "LOW" : Math.random() > 0.4 ? "MEDIUM" : "HIGH",
        originCountry: "United States",
        ipReputation: Math.random() > 0.3 ? "Good" : "Suspicious",
      })
      setAnalyzing(false)
    }, 2500)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "LOW":
        return "text-success"
      case "MEDIUM":
        return "text-yellow-500"
      case "HIGH":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="h-5 w-5 text-primary" />
          <span>Email Header Analyzer</span>
        </CardTitle>
        <CardDescription>Analyze email headers for authentication, security, and potential threats</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email Headers</label>
          <Textarea
            placeholder="Paste email headers here..."
            value={emailHeaders}
            onChange={(e) => setEmailHeaders(e.target.value)}
            className="min-h-32 font-mono text-xs"
          />
        </div>

        <Button onClick={handleAnalyze} disabled={analyzing || !emailHeaders.trim()} className="cyber-button w-full">
          {analyzing ? "Analyzing..." : "Analyze Headers"}
        </Button>

        {results && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <div className="text-sm text-muted-foreground">SPF Status</div>
                <div className={`font-bold ${results.spfStatus === "PASS" ? "text-success" : "text-destructive"}`}>
                  {results.spfStatus}
                </div>
              </div>
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <div className="text-sm text-muted-foreground">DKIM Status</div>
                <div className={`font-bold ${results.dkimStatus === "PASS" ? "text-success" : "text-destructive"}`}>
                  {results.dkimStatus}
                </div>
              </div>
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <div className="text-sm text-muted-foreground">DMARC Status</div>
                <div className={`font-bold ${results.dmarcStatus === "PASS" ? "text-success" : "text-destructive"}`}>
                  {results.dmarcStatus}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Risk Level:</span>
              </div>
              <Badge className={getRiskColor(results.riskLevel)}>{results.riskLevel}</Badge>
            </div>

            {results.suspiciousElements.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-destructive flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Suspicious Elements:</span>
                </h4>
                {results.suspiciousElements.map((element: string, index: number) => (
                  <Badge key={index} variant="destructive" className="mr-2">
                    {element}
                  </Badge>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Origin Country:</span>
                <span className="ml-2">{results.originCountry}</span>
              </div>
              <div>
                <span className="text-muted-foreground">IP Reputation:</span>
                <span className={`ml-2 ${results.ipReputation === "Good" ? "text-success" : "text-destructive"}`}>
                  {results.ipReputation}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
