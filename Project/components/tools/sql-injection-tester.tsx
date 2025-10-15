"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Database, CheckCircle, XCircle } from "lucide-react"

interface SQLTestResult {
  url: string
  vulnerable: boolean
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  vulnerabilities: {
    type: string
    parameter: string
    payload: string
    description: string
  }[]
  recommendations: string[]
}

export default function SQLInjectionTester() {
  const [url, setUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<SQLTestResult | null>(null)

  const testSQLInjection = async () => {
    if (!url) return

    setIsScanning(true)

    // Simulate SQL injection testing with realistic patterns
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const sqlPayloads = [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "' UNION SELECT * FROM users --",
      "admin'--",
      "' OR 1=1 --",
    ]

    const vulnerabilities = []
    const isVulnerable = Math.random() > 0.7 // 30% chance of vulnerability

    if (isVulnerable) {
      vulnerabilities.push({
        type: "Boolean-based blind SQL injection",
        parameter: "id",
        payload: "' OR '1'='1",
        description: "Application is vulnerable to boolean-based blind SQL injection",
      })
    }

    const riskLevel = isVulnerable
      ? vulnerabilities.length > 2
        ? "Critical"
        : vulnerabilities.length > 1
          ? "High"
          : "Medium"
      : "Low"

    setResult({
      url,
      vulnerable: isVulnerable,
      riskLevel,
      vulnerabilities,
      recommendations: isVulnerable
        ? [
            "Use parameterized queries or prepared statements",
            "Implement input validation and sanitization",
            "Apply principle of least privilege to database accounts",
            "Enable SQL injection detection in WAF",
            "Regular security testing and code review",
          ]
        : [
            "Continue using secure coding practices",
            "Regular security assessments recommended",
            "Monitor for new attack vectors",
          ],
    })

    setIsScanning(false)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Critical":
        return "text-red-500 border-red-500"
      case "High":
        return "text-orange-500 border-orange-500"
      case "Medium":
        return "text-yellow-500 border-yellow-500"
      default:
        return "text-green-500 border-green-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="url">Target URL</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com/login.php?id=1"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="cyber-input"
          />
        </div>

        <Button onClick={testSQLInjection} disabled={!url || isScanning} className="cyber-button">
          {isScanning ? (
            <>
              <Database className="w-4 h-4 mr-2 animate-spin" />
              Testing SQL Injection...
            </>
          ) : (
            <>
              <Database className="w-4 h-4 mr-2" />
              Test SQL Injection
            </>
          )}
        </Button>
      </div>

      {result && (
        <div className="space-y-4">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.vulnerable ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                SQL Injection Test Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Risk Level:</span>
                <Badge className={getRiskColor(result.riskLevel)}>{result.riskLevel}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className={result.vulnerable ? "text-red-500" : "text-green-500"}>
                  {result.vulnerable ? "Vulnerable" : "Secure"}
                </span>
              </div>

              {result.vulnerabilities.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Detected Vulnerabilities
                  </h4>
                  <div className="space-y-2">
                    {result.vulnerabilities.map((vuln, index) => (
                      <div key={index} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="font-medium text-red-400">{vuln.type}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Parameter: <code className="bg-background px-1 rounded">{vuln.parameter}</code>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Payload: <code className="bg-background px-1 rounded">{vuln.payload}</code>
                        </div>
                        <div className="text-sm mt-2">{vuln.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Security Recommendations
                </h4>
                <ul className="space-y-1">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
