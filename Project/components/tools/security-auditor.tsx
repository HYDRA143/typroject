"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

export function SecurityAuditor() {
  const [target, setTarget] = useState("")
  const [auditing, setAuditing] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleAudit = async () => {
    if (!target.trim()) return

    setAuditing(true)
    // Simulate security audit
    setTimeout(() => {
      const vulnerabilities =
        Math.random() > 0.5
          ? [
              {
                severity: "HIGH",
                type: "SQL Injection",
                description: "Potential SQL injection vulnerability detected",
              },
              { severity: "MEDIUM", type: "XSS", description: "Cross-site scripting vulnerability found" },
              { severity: "LOW", type: "Information Disclosure", description: "Server information exposed in headers" },
            ]
          : []

      setResults({
        target,
        overallScore: Math.floor(Math.random() * 40) + 60,
        vulnerabilities,
        securityHeaders: {
          "Content-Security-Policy": Math.random() > 0.5,
          "X-Frame-Options": Math.random() > 0.3,
          "X-XSS-Protection": Math.random() > 0.4,
          "Strict-Transport-Security": Math.random() > 0.6,
        },
        sslGrade: ["A+", "A", "B", "C"][Math.floor(Math.random() * 4)],
        openPorts: [80, 443, 22].filter(() => Math.random() > 0.5),
      })
      setAuditing(false)
    }, 4000)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "HIGH":
        return "destructive"
      case "MEDIUM":
        return "default"
      case "LOW":
        return "secondary"
      default:
        return "default"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success"
    if (score >= 60) return "text-yellow-500"
    return "text-destructive"
  }

  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-primary" />
          <span>Security Auditor</span>
        </CardTitle>
        <CardDescription>Comprehensive security audit for websites and web applications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter website URL (e.g., https://example.com)"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAudit} disabled={auditing || !target.trim()} className="cyber-button">
            {auditing ? "Auditing..." : "Start Audit"}
          </Button>
        </div>

        {auditing && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Scanning security headers...</div>
            <Progress value={33} className="w-full" />
          </div>
        )}

        {results && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="text-center p-6 bg-primary/10 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Security Score</div>
              <div className={`text-4xl font-bold ${getScoreColor(results.overallScore)}`}>
                {results.overallScore}/100
              </div>
            </div>

            {/* Vulnerabilities */}
            {results.vulnerabilities.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-destructive flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Vulnerabilities Found:</span>
                </h4>
                {results.vulnerabilities.map((vuln: any, index: number) => (
                  <div key={index} className="p-3 bg-card/50 rounded-lg border-l-4 border-destructive">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{vuln.type}</span>
                      <Badge variant={getSeverityColor(vuln.severity)}>{vuln.severity}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{vuln.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Security Headers */}
            <div className="space-y-3">
              <h4 className="font-medium">Security Headers:</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(results.securityHeaders).map(([header, present]) => (
                  <div key={header} className="flex items-center space-x-2 text-sm">
                    {present ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span className={present ? "text-success" : "text-destructive"}>{header}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">SSL Grade:</span>
                <span className="ml-2 font-bold text-primary">{results.sslGrade}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Open Ports:</span>
                <span className="ml-2">{results.openPorts.join(", ") || "None detected"}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
