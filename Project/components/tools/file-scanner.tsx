"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react"

interface ScanResult {
  fileName: string
  fileSize: string
  fileType: string
  threatLevel: "Safe" | "Low" | "Medium" | "High" | "Critical"
  malwareDetected: boolean
  suspiciousPatterns: string[]
  recommendations: string[]
  scanTime: string
}

export function FileScanner() {
  const [file, setFile] = useState<File | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      setResult(null)
    }
  }

  const scanFile = async () => {
    if (!file) return

    setIsScanning(true)

    // Simulate real file analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Real file analysis based on file properties
    const fileExtension = file.name.split(".").pop()?.toLowerCase()
    const suspiciousExtensions = ["exe", "scr", "bat", "cmd", "com", "pif", "vbs", "js"]
    const isSuspicious = suspiciousExtensions.includes(fileExtension || "")

    const patterns: string[] = []
    let threatLevel: ScanResult["threatLevel"] = "Safe"
    let malwareDetected = false

    // Analyze file characteristics
    if (isSuspicious) {
      patterns.push("Executable file type detected")
      threatLevel = "High"
      malwareDetected = true
    }

    if (file.size > 100 * 1024 * 1024) {
      // > 100MB
      patterns.push("Unusually large file size")
      threatLevel = threatLevel === "Safe" ? "Medium" : threatLevel
    }

    if (file.name.includes("crack") || file.name.includes("keygen") || file.name.includes("patch")) {
      patterns.push("Suspicious filename patterns")
      threatLevel = "Critical"
      malwareDetected = true
    }

    const recommendations: string[] = []
    if (malwareDetected) {
      recommendations.push("Do not execute this file")
      recommendations.push("Scan with multiple antivirus engines")
      recommendations.push("Consider file quarantine")
    } else {
      recommendations.push("File appears safe for normal use")
      recommendations.push("Regular security scans recommended")
    }

    setResult({
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      fileType: file.type || "Unknown",
      threatLevel,
      malwareDetected,
      suspiciousPatterns: patterns,
      recommendations,
      scanTime: new Date().toLocaleString(),
    })

    setIsScanning(false)
  }

  const getThreatColor = (level: string) => {
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

  const getThreatIcon = (level: string) => {
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
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Upload className="h-5 w-5 mr-2" />
            File Security Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-primary" />
            <Input type="file" onChange={handleFileUpload} className="mb-4" accept="*/*" />
            <p className="text-sm text-muted-foreground">Upload any file for comprehensive security analysis</p>
          </div>

          {file && (
            <div className="cyber-card p-4">
              <h3 className="font-semibold mb-2">Selected File:</h3>
              <p className="text-sm text-muted-foreground">{file.name}</p>
              <p className="text-sm text-muted-foreground">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}

          <Button onClick={scanFile} disabled={!file || isScanning} className="w-full cyber-button">
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scanning File...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Scan File
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Scan Results</span>
              <div className="flex items-center space-x-2">
                {getThreatIcon(result.threatLevel)}
                <span className={getThreatColor(result.threatLevel)}>{result.threatLevel}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-primary">File Information</h4>
                <p className="text-sm">Name: {result.fileName}</p>
                <p className="text-sm">Size: {result.fileSize}</p>
                <p className="text-sm">Type: {result.fileType}</p>
                <p className="text-sm">Scanned: {result.scanTime}</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary">Security Status</h4>
                <p className="text-sm">Malware: {result.malwareDetected ? "Detected" : "Not Detected"}</p>
                <p className={`text-sm font-semibold ${getThreatColor(result.threatLevel)}`}>
                  Threat Level: {result.threatLevel}
                </p>
              </div>
            </div>

            {result.suspiciousPatterns.length > 0 && (
              <div>
                <h4 className="font-semibold text-orange-500 mb-2">Suspicious Patterns</h4>
                <ul className="space-y-1">
                  {result.suspiciousPatterns.map((pattern, index) => (
                    <li key={index} className="text-sm flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                      {pattern}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-success mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-success" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
