"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Search, CheckCircle, XCircle, Folder, File } from "lucide-react"

interface DirectoryResult {
  url: string
  hasDirectoryListing: boolean
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  exposedDirectories: {
    path: string
    files: string[]
    sensitiveFiles: string[]
  }[]
  recommendations: string[]
}

export default function DirectoryListingChecker() {
  const [url, setUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<DirectoryResult | null>(null)

  const checkDirectoryListing = async () => {
    if (!url) return

    setIsScanning(true)

    // Simulate directory listing check
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const hasListing = Math.random() > 0.8 // 20% chance of exposed directories
    const exposedDirectories = []

    if (hasListing) {
      exposedDirectories.push({
        path: "/uploads/",
        files: ["document1.pdf", "image.jpg", "backup.zip", "config.txt"],
        sensitiveFiles: ["backup.zip", "config.txt"],
      })

      if (Math.random() > 0.5) {
        exposedDirectories.push({
          path: "/admin/",
          files: ["login.php", "dashboard.php", "users.csv"],
          sensitiveFiles: ["users.csv"],
        })
      }
    }

    const riskLevel = hasListing
      ? exposedDirectories.some((dir) => dir.sensitiveFiles.length > 0)
        ? "High"
        : "Medium"
      : "Low"

    setResult({
      url,
      hasDirectoryListing: hasListing,
      riskLevel,
      exposedDirectories,
      recommendations: hasListing
        ? [
            "Disable directory listing in web server configuration",
            "Add index.html files to directories",
            "Implement proper access controls",
            "Review exposed files for sensitive information",
            "Use .htaccess to prevent directory browsing",
          ]
        : [
            "Directory listing is properly disabled",
            "Continue monitoring for configuration changes",
            "Regular security assessments recommended",
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
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="cyber-input"
          />
        </div>

        <Button onClick={checkDirectoryListing} disabled={!url || isScanning} className="cyber-button">
          {isScanning ? (
            <>
              <Search className="w-4 h-4 mr-2 animate-spin" />
              Checking Directory Listing...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Check Directory Listing
            </>
          )}
        </Button>
      </div>

      {result && (
        <div className="space-y-4">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.hasDirectoryListing ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                Directory Listing Check Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Risk Level:</span>
                <Badge className={getRiskColor(result.riskLevel)}>{result.riskLevel}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className={result.hasDirectoryListing ? "text-red-500" : "text-green-500"}>
                  {result.hasDirectoryListing ? "Directory Listing Enabled" : "Directory Listing Disabled"}
                </span>
              </div>

              {result.exposedDirectories.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Exposed Directories
                  </h4>
                  <div className="space-y-3">
                    {result.exposedDirectories.map((dir, index) => (
                      <div key={index} className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <div className="font-medium text-orange-400 flex items-center gap-2">
                          <Folder className="w-4 h-4" />
                          {dir.path}
                        </div>
                        <div className="mt-2 space-y-1">
                          {dir.files.map((file, fileIndex) => (
                            <div key={fileIndex} className="text-sm flex items-center gap-2">
                              <File className="w-3 h-3" />
                              <span
                                className={dir.sensitiveFiles.includes(file) ? "text-red-400" : "text-muted-foreground"}
                              >
                                {file}
                              </span>
                              {dir.sensitiveFiles.includes(file) && (
                                <Badge variant="destructive" className="text-xs">
                                  Sensitive
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
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
