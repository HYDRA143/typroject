"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Archive, Upload, File, CheckCircle, XCircle } from "lucide-react"

interface ZipAnalysis {
  fileName: string
  fileSize: string
  fileCount: number
  compressedSize: string
  uncompressedSize: string
  compressionRatio: string
  files: {
    name: string
    size: string
    type: string
    suspicious: boolean
    reason?: string
  }[]
  threats: {
    type: string
    description: string
    severity: string
  }[]
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  recommendations: string[]
}

export default function ZipFileScanner() {
  const [file, setFile] = useState<File | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [analysis, setAnalysis] = useState<ZipAnalysis | null>(null)

  const scanZipFile = async () => {
    if (!file) return

    setIsScanning(true)

    // Simulate ZIP file analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const files = [
      { name: "document.pdf", size: "2.1 MB", type: "PDF", suspicious: false },
      { name: "image.jpg", size: "1.5 MB", type: "Image", suspicious: false },
      {
        name: "script.exe",
        size: "500 KB",
        type: "Executable",
        suspicious: true,
        reason: "Executable file in archive",
      },
      { name: "data.txt", size: "10 KB", type: "Text", suspicious: false },
      { name: "config.bat", size: "2 KB", type: "Batch", suspicious: true, reason: "Batch script detected" },
    ]

    const threats = []
    const suspiciousFiles = files.filter((f) => f.suspicious)

    if (suspiciousFiles.length > 0) {
      threats.push({
        type: "Suspicious Files Detected",
        description: `Found ${suspiciousFiles.length} potentially dangerous files`,
        severity: "High",
      })
    }

    if (files.some((f) => f.name.includes(".."))) {
      threats.push({
        type: "Directory Traversal",
        description: "Archive contains path traversal sequences",
        severity: "Critical",
      })
    }

    const riskLevel = threats.some((t) => t.severity === "Critical")
      ? "Critical"
      : threats.some((t) => t.severity === "High")
        ? "High"
        : threats.length > 0
          ? "Medium"
          : "Low"

    setAnalysis({
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      fileCount: files.length,
      compressedSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uncompressedSize: "8.2 MB",
      compressionRatio: "65%",
      files,
      threats,
      riskLevel,
      recommendations: [
        "Scan extracted files with antivirus",
        "Extract to isolated directory",
        "Review file contents before execution",
        "Avoid extracting executable files",
        "Use updated extraction software",
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
          <Label htmlFor="zip-file">ZIP Archive</Label>
          <Input
            id="zip-file"
            type="file"
            accept=".zip,.rar,.7z,.tar,.gz"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="cyber-input"
          />
        </div>

        <Button onClick={scanZipFile} disabled={!file || isScanning} className="cyber-button">
          {isScanning ? (
            <>
              <Archive className="w-4 h-4 mr-2 animate-spin" />
              Scanning Archive...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Scan Archive
            </>
          )}
        </Button>
      </div>

      {analysis && (
        <div className="space-y-4">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="w-5 h-5 text-primary" />
                ZIP Archive Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">File Name:</span>
                  <div className="font-medium">{analysis.fileName}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">File Count:</span>
                  <div className="font-medium">{analysis.fileCount} files</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Compressed Size:</span>
                  <div className="font-medium">{analysis.compressedSize}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Compression Ratio:</span>
                  <div className="font-medium">{analysis.compressionRatio}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Risk Level:</span>
                <Badge className={getRiskColor(analysis.riskLevel)}>{analysis.riskLevel}</Badge>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Archive Contents</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {analysis.files.map((file, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 p-2 rounded ${file.suspicious ? "bg-red-500/10 border border-red-500/20" : "bg-background/50"}`}
                    >
                      <File className={`w-4 h-4 ${file.suspicious ? "text-red-500" : "text-muted-foreground"}`} />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{file.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {file.type} • {file.size}
                        </div>
                        {file.suspicious && file.reason && <div className="text-xs text-red-400">{file.reason}</div>}
                      </div>
                      {file.suspicious ? (
                        <XCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {analysis.threats.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Security Threats
                  </h4>
                  <div className="space-y-2">
                    {analysis.threats.map((threat, index) => (
                      <div key={index} className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <div className="font-medium text-orange-400">{threat.type}</div>
                        <div className="text-sm text-muted-foreground mt-1">{threat.description}</div>
                        <Badge className="mt-2" variant={threat.severity === "Critical" ? "destructive" : "secondary"}>
                          {threat.severity}
                        </Badge>
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
                  {analysis.recommendations.map((rec, index) => (
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
