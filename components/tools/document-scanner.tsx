"use client"
import { useState, useRef } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Shield, Upload, FileText, Eye, Database } from "lucide-react"

interface DocumentScanResult {
  fileName: string
  fileType: string
  fileSize: number
  scanTime: number
  threats: Array<{
    type: string
    description: string
    severity: "low" | "medium" | "high" | "critical"
    location: string
  }>
  metadata: {
    author?: string
    creator?: string
    producer?: string
    creationDate?: string
    modificationDate?: string
    title?: string
    subject?: string
    keywords?: string[]
  }
  hiddenContent: {
    macros: string[]
    scripts: string[]
    embeddedFiles: string[]
    hiddenText: string[]
  }
  riskScore: number
  threatLevel: "SAFE" | "SUSPICIOUS" | "DANGEROUS" | "MALICIOUS"
}

export function DocumentScanner() {
  const [file, setFile] = useState<File | null>(null)
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<DocumentScanResult | null>(null)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      // Check if it's a document file
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ]

      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Please select a valid document file (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX)")
        return
      }

      if (selectedFile.size > 50 * 1024 * 1024) {
        setError("File size must be less than 50MB")
        return
      }

      setFile(selectedFile)
      setError("")
      setResult(null)
    }
  }

  const scanDocument = async () => {
    if (!file) {
      setError("Please select a document to scan")
      return
    }

    setScanning(true)
    setProgress(0)
    setError("")
    setResult(null)

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + Math.random() * 10
        })
      }, 300)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/scan-document", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        throw new Error("Failed to scan document")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError("Failed to scan document. Please try again.")
    } finally {
      setScanning(false)
      setTimeout(() => setProgress(0), 1000)
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
            <FileText className="h-5 w-5 mr-2" />
            Document Security Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            />
            {file ? (
              <div className="space-y-2">
                <FileText className="h-12 w-12 mx-auto text-primary" />
                <p className="font-medium text-primary">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {file.type} • {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
                  Change Document
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Select a document to scan for threats</p>
                <p className="text-xs text-muted-foreground">Supports PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX</p>
                <Button onClick={() => fileInputRef.current?.click()} className="cyber-button">
                  Select Document
                </Button>
              </div>
            )}
          </div>

          {scanning && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Analyzing document structure...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <Button onClick={scanDocument} disabled={!file || scanning} className="cyber-button w-full">
            {scanning ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                Scanning Document...
              </div>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Scan Document
              </>
            )}
          </Button>

          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">{error}</div>}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {/* Scan Summary */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center text-primary">
                  <Shield className="h-5 w-5 mr-2" />
                  Document Analysis
                </span>
                <Badge className={getThreatColor(result.threatLevel)}>{result.threatLevel}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{result.riskScore}/100</div>
                  <div className="text-sm text-muted-foreground">Risk Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{result.threats.length}</div>
                  <div className="text-sm text-muted-foreground">Threats Found</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{result.scanTime}s</div>
                  <div className="text-sm text-muted-foreground">Scan Time</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="threats" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="threats">Security Threats</TabsTrigger>
              <TabsTrigger value="metadata">Document Metadata</TabsTrigger>
              <TabsTrigger value="hidden">Hidden Content</TabsTrigger>
            </TabsList>

            <TabsContent value="threats">
              {result.threats.length > 0 ? (
                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-400">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Security Threats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.threats.map((threat, index) => (
                      <div key={index} className="border border-red-500/20 rounded-lg p-4 bg-red-500/5">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-red-400">{threat.type}</h4>
                          <Badge className={getSeverityColor(threat.severity)}>{threat.severity.toUpperCase()}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{threat.description}</p>
                        <div className="text-sm">
                          <span className="text-primary">Location:</span> {threat.location}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Card className="cyber-card">
                  <CardContent className="text-center py-8">
                    <Shield className="h-12 w-12 mx-auto text-green-400 mb-4" />
                    <p className="text-green-400 font-medium">No security threats detected</p>
                    <p className="text-sm text-muted-foreground">This document appears to be safe</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="metadata">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Database className="h-5 w-5 mr-2" />
                    Document Metadata
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(result.metadata).map(
                    ([key, value]) =>
                      value && (
                        <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <span className="text-primary font-medium capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span className="md:col-span-2 text-muted-foreground">
                            {Array.isArray(value) ? value.join(", ") : value}
                          </span>
                        </div>
                      ),
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hidden">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-400">
                    <Eye className="h-5 w-5 mr-2" />
                    Hidden Content Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.hiddenContent.macros.length > 0 && (
                    <div>
                      <h4 className="font-medium text-primary mb-2">Macros Found</h4>
                      <ul className="space-y-1">
                        {result.hiddenContent.macros.map((macro, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            • {macro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.hiddenContent.scripts.length > 0 && (
                    <div>
                      <h4 className="font-medium text-primary mb-2">Scripts Detected</h4>
                      <ul className="space-y-1">
                        {result.hiddenContent.scripts.map((script, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            • {script}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.hiddenContent.embeddedFiles.length > 0 && (
                    <div>
                      <h4 className="font-medium text-primary mb-2">Embedded Files</h4>
                      <ul className="space-y-1">
                        {result.hiddenContent.embeddedFiles.map((file, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            • {file}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.hiddenContent.hiddenText.length > 0 && (
                    <div>
                      <h4 className="font-medium text-primary mb-2">Hidden Text</h4>
                      <ul className="space-y-1">
                        {result.hiddenContent.hiddenText.map((text, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            • {text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {Object.values(result.hiddenContent).every((arr) => arr.length === 0) && (
                    <div className="text-center py-4">
                      <p className="text-green-400">No hidden content detected</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
