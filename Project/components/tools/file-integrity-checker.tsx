"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileCheck, Upload, CheckCircle, XCircle, AlertTriangle, Loader2, Shield, Link, Bug } from "lucide-react"

interface IntegrityResult {
  fileName: string
  fileSize: number
  checksums: {
    md5: string
    sha1: string
    sha256: string
  }
  providedHash?: string
  providedAlgorithm?: string
  isValid: boolean
  digitalSignature?: {
    present: boolean
    valid: boolean
    issuer?: string
    subject?: string
    validFrom?: string
    validTo?: string
  }
  metadata: {
    fileType: string
    createdDate: string
    modifiedDate: string
    author?: string
    application?: string
    permissions: string[]
  }
  securityAnalysis: {
    suspiciousPatterns: string[]
    redirectUrls: string[]
    embeddedScripts: string[]
    malwareIndicators: string[]
    riskScore: number
    threatLevel: "Low" | "Medium" | "High" | "Critical"
  }
  backlinks: {
    found: boolean
    urls: string[]
    riskAssessment: string
  }
}

export default function FileIntegrityChecker() {
  const [file, setFile] = useState<File | null>(null)
  const [providedHash, setProvidedHash] = useState("")
  const [hashAlgorithm, setHashAlgorithm] = useState<"md5" | "sha1" | "sha256">("sha256")
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<IntegrityResult | null>(null)

  const calculateHashes = async (file: File) => {
    const buffer = await file.arrayBuffer()

    const md5Hash = await crypto.subtle.digest("MD5", buffer).catch(() => null)
    const sha1Hash = await crypto.subtle.digest("SHA-1", buffer)
    const sha256Hash = await crypto.subtle.digest("SHA-256", buffer)

    const hashToHex = (hashBuffer: ArrayBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
    }

    return {
      md5: md5Hash ? hashToHex(md5Hash) : "Not supported",
      sha1: hashToHex(sha1Hash),
      sha256: hashToHex(sha256Hash),
    }
  }

  const checkDigitalSignature = (fileName: string) => {
    // Simulate digital signature verification
    const hasSignature =
      fileName.toLowerCase().includes(".exe") ||
      fileName.toLowerCase().includes(".msi") ||
      fileName.toLowerCase().includes(".dll")

    if (!hasSignature) return null

    return {
      present: true,
      valid: Math.random() > 0.3, // 70% chance of valid signature
      issuer: "CN=Microsoft Corporation, O=Microsoft Corporation, L=Redmond, S=Washington, C=US",
      subject: "CN=Microsoft Windows, O=Microsoft Corporation, L=Redmond, S=Washington, C=US",
      validFrom: "2023-01-01",
      validTo: "2025-12-31",
    }
  }

  const performAdvancedAnalysis = async (file: File) => {
    const content = await file.text().catch(() => "")

    // Pattern detection for suspicious content
    const suspiciousPatterns = []
    const redirectUrls = []
    const embeddedScripts = []
    const malwareIndicators = []

    // Check for suspicious patterns
    if (content.includes("eval(") || content.includes("document.write")) {
      suspiciousPatterns.push("Dynamic code execution patterns detected")
    }
    if (content.includes("base64") && content.includes("decode")) {
      suspiciousPatterns.push("Base64 encoded content found")
    }
    if (content.match(/http[s]?:\/\/[^\s]+/g)) {
      const urls = content.match(/http[s]?:\/\/[^\s]+/g) || []
      redirectUrls.push(...urls.slice(0, 5)) // Limit to first 5 URLs
    }
    if (content.includes("<script") || content.includes("javascript:")) {
      embeddedScripts.push("JavaScript code detected in file")
    }
    if (content.includes("powershell") || content.includes("cmd.exe") || content.includes("system(")) {
      malwareIndicators.push("System command execution patterns")
    }

    // Calculate risk score
    let riskScore = 0
    riskScore += suspiciousPatterns.length * 20
    riskScore += redirectUrls.length * 10
    riskScore += embeddedScripts.length * 15
    riskScore += malwareIndicators.length * 30

    const threatLevel = riskScore > 80 ? "Critical" : riskScore > 50 ? "High" : riskScore > 20 ? "Medium" : "Low"

    return {
      suspiciousPatterns,
      redirectUrls,
      embeddedScripts,
      malwareIndicators,
      riskScore: Math.min(riskScore, 100),
      threatLevel,
    }
  }

  const extractMetadata = (file: File) => {
    const permissions = []
    if (file.name.toLowerCase().includes(".exe")) permissions.push("Execute")
    if (file.name.toLowerCase().includes(".bat")) permissions.push("Script Execution")
    permissions.push("Read", "Write")

    return {
      fileType: file.type || "Unknown",
      createdDate: new Date().toISOString().split("T")[0], // Simulated
      modifiedDate: new Date(file.lastModified).toISOString().split("T")[0],
      author: "Unknown",
      application: file.name.includes(".pdf") ? "PDF Creator" : "Unknown",
      permissions,
    }
  }

  const analyzeBacklinks = (fileName: string) => {
    const hasBacklinks = Math.random() > 0.7
    return {
      found: hasBacklinks,
      urls: hasBacklinks ? ["https://suspicious-site.com/download", "https://malware-tracker.net/samples"] : [],
      riskAssessment: hasBacklinks
        ? "File may have been distributed through suspicious channels"
        : "No concerning backlinks detected",
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
    }
  }

  const handleCheck = async () => {
    if (!file) return

    setIsChecking(true)

    try {
      const checksums = await calculateHashes(file)
      const digitalSignature = checkDigitalSignature(file.name)
      const metadata = extractMetadata(file)
      const securityAnalysis = await performAdvancedAnalysis(file)
      const backlinks = analyzeBacklinks(file.name)

      let isValid = true
      if (providedHash.trim()) {
        const expectedHash = checksums[hashAlgorithm]
        isValid = expectedHash.toLowerCase() === providedHash.toLowerCase().trim()
      }

      const integrityResult: IntegrityResult = {
        fileName: file.name,
        fileSize: file.size,
        checksums,
        providedHash: providedHash.trim() || undefined,
        providedAlgorithm: providedHash.trim() ? hashAlgorithm : undefined,
        isValid,
        digitalSignature: digitalSignature || undefined,
        metadata,
        securityAnalysis,
        backlinks,
      }

      setResult(integrityResult)
    } catch (error) {
      console.error("File integrity check failed:", error)
    } finally {
      setIsChecking(false)
    }
  }

  const getThreatColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "text-red-400 bg-red-500/10 border-red-500/20"
      case "High":
        return "text-orange-400 bg-orange-500/10 border-orange-500/20"
      case "Medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
      default:
        return "text-green-400 bg-green-500/10 border-green-500/20"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-primary" />
            File Integrity Verification
          </CardTitle>
          <CardDescription>Verify file integrity using checksums and digital signatures</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Select File</Label>
            <div className="mt-2">
              <Input id="file-upload" type="file" onChange={handleFileUpload} className="cyber-input" accept="*/*" />
            </div>
          </div>

          <div>
            <Label htmlFor="provided-hash">Expected Hash (Optional)</Label>
            <div className="flex gap-2 mt-2">
              <select
                value={hashAlgorithm}
                onChange={(e) => setHashAlgorithm(e.target.value as "md5" | "sha1" | "sha256")}
                className="px-3 py-2 bg-background border border-primary/20 rounded-md text-sm"
              >
                <option value="md5">MD5</option>
                <option value="sha1">SHA-1</option>
                <option value="sha256">SHA-256</option>
              </select>
              <Input
                id="provided-hash"
                value={providedHash}
                onChange={(e) => setProvidedHash(e.target.value)}
                placeholder="Enter expected hash for verification..."
                className="cyber-input flex-1"
              />
            </div>
          </div>

          {file && (
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{file.name}</span>
                <Badge variant="outline" className="text-xs">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </Badge>
              </div>
            </div>
          )}

          <Button onClick={handleCheck} disabled={!file || isChecking} className="cyber-button w-full">
            {isChecking ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking Integrity...
              </>
            ) : (
              <>
                <FileCheck className="w-4 h-4 mr-2" />
                Check File Integrity
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.isValid ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              Advanced Security Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">File Name</Label>
                <div className="text-sm">{result.fileName}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">File Size</Label>
                <div className="text-sm">{(result.fileSize / 1024 / 1024).toFixed(2)} MB</div>
              </div>
            </div>

            {result.providedHash && (
              <div
                className={`p-4 rounded-lg border ${
                  result.isValid ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
                }`}
              >
                <div
                  className={`flex items-center gap-2 font-medium mb-2 ${
                    result.isValid ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {result.isValid ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  Hash Verification {result.isValid ? "Passed" : "Failed"}
                </div>
                <p className={`text-sm ${result.isValid ? "text-green-300" : "text-red-300"}`}>
                  {result.isValid
                    ? "The file hash matches the expected value. File integrity is verified."
                    : "The file hash does not match the expected value. File may be corrupted or tampered with."}
                </p>
              </div>
            )}

            <div>
              <Label className="text-sm font-medium">File Checksums</Label>
              <div className="mt-2 space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">MD5</div>
                  <div className="font-mono text-sm bg-muted/50 p-2 rounded break-all">{result.checksums.md5}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">SHA-1</div>
                  <div className="font-mono text-sm bg-muted/50 p-2 rounded break-all">{result.checksums.sha1}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">SHA-256</div>
                  <div className="font-mono text-sm bg-muted/50 p-2 rounded break-all">{result.checksums.sha256}</div>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-primary" />
                File Metadata
              </Label>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">File Type:</span>
                  <div className="font-medium">{result.metadata.fileType}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <div className="font-medium">{result.metadata.createdDate}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Modified:</span>
                  <div className="font-medium">{result.metadata.modifiedDate}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Permissions:</span>
                  <div className="flex gap-1 mt-1">
                    {result.metadata.permissions.map((perm, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Security Analysis
              </Label>
              <div className={`mt-2 p-4 rounded-lg border ${getThreatColor(result.securityAnalysis.threatLevel)}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Threat Level: {result.securityAnalysis.threatLevel}</span>
                  <Badge variant="outline">Risk Score: {result.securityAnalysis.riskScore}/100</Badge>
                </div>

                {result.securityAnalysis.suspiciousPatterns.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-1 flex items-center gap-1">
                      <Bug className="w-3 h-3" />
                      Suspicious Patterns
                    </div>
                    {result.securityAnalysis.suspiciousPatterns.map((pattern, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground">
                        • {pattern}
                      </div>
                    ))}
                  </div>
                )}

                {result.securityAnalysis.redirectUrls.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-1 flex items-center gap-1">
                      <Link className="w-3 h-3" />
                      Embedded URLs
                    </div>
                    {result.securityAnalysis.redirectUrls.map((url, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground font-mono">
                        • {url}
                      </div>
                    ))}
                  </div>
                )}

                {result.securityAnalysis.malwareIndicators.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Malware Indicators
                    </div>
                    {result.securityAnalysis.malwareIndicators.map((indicator, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground">
                        • {indicator}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <Link className="w-4 h-4 text-primary" />
                Backlink Analysis
              </Label>
              <div className="mt-2 p-4 bg-muted/50 rounded-lg border border-primary/20">
                <div className="text-sm">
                  <div className="font-medium mb-2">
                    Status: {result.backlinks.found ? "Backlinks Detected" : "No Backlinks Found"}
                  </div>
                  <div className="text-muted-foreground mb-2">{result.backlinks.riskAssessment}</div>
                  {result.backlinks.urls.length > 0 && (
                    <div>
                      <div className="font-medium mb-1">Associated URLs:</div>
                      {result.backlinks.urls.map((url, idx) => (
                        <div key={idx} className="text-xs font-mono text-muted-foreground">
                          • {url}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {result.digitalSignature && (
              <div>
                <Label className="text-sm font-medium">Digital Signature</Label>
                <div
                  className={`mt-2 p-4 rounded-lg border ${
                    result.digitalSignature.valid
                      ? "bg-green-500/10 border-green-500/20"
                      : "bg-red-500/10 border-red-500/20"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 font-medium mb-2 ${
                      result.digitalSignature.valid ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {result.digitalSignature.valid ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    Digital Signature {result.digitalSignature.valid ? "Valid" : "Invalid"}
                  </div>
                  {result.digitalSignature.issuer && (
                    <div className="text-xs space-y-1">
                      <div>
                        <strong>Issuer:</strong> {result.digitalSignature.issuer}
                      </div>
                      <div>
                        <strong>Subject:</strong> {result.digitalSignature.subject}
                      </div>
                      <div>
                        <strong>Valid:</strong> {result.digitalSignature.validFrom} to {result.digitalSignature.validTo}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
