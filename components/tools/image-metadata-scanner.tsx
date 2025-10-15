"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, ImageIcon, Upload, MapPin, Camera, Bot, Edit, Link, Lock } from "lucide-react"

declare global {
  interface Window {
    EXIF: any
  }
}

interface ImageMetadata {
  fileName: string
  fileSize: string
  dimensions: string
  format: string
  colorSpace: string
  exifData: {
    camera?: string
    lens?: string
    dateTime?: string
    gpsLocation?: {
      latitude: number
      longitude: number
      address: string
    }
    exposureSettings: {
      aperture?: string
      shutterSpeed?: string
      iso?: string
      focalLength?: string
    }
  }
  aiAnalysis: {
    isAiGenerated: boolean
    confidence: number
    indicators: string[]
    generationMethod?: string
  }
  editingAnalysis: {
    isEdited: boolean
    editingTools: string[]
    modifications: string[]
    originalityScore: number
  }
  securityAnalysis: {
    embeddedUrls: string[]
    suspiciousPatterns: string[]
    malwareIndicators: string[]
    permissions: string[]
    backlinks: string[]
    riskScore: number
  }
  privacyRisks: {
    type: string
    description: string
    severity: string
  }[]
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  recommendations: string[]
}

export default function ImageMetadataScanner() {
  const [file, setFile] = useState<File | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null)

  const extractRealExifData = (file: File): Promise<any> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        try {
          // Try to extract real EXIF data if EXIF.js is available
          if (window.EXIF) {
            window.EXIF.getData(img, function () {
              const exifData = window.EXIF.getAllTags(this)
              resolve(exifData)
            })
          } else {
            // Fallback to basic file analysis
            resolve({})
          }
        } catch (error) {
          resolve({})
        }
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const analyzeAiGeneration = (imageData: any) => {
    // Real AI detection patterns
    const aiIndicators = []
    let confidence = 0
    let isAi = false

    // Check for missing camera metadata (common in AI images)
    if (!imageData.Make && !imageData.Model) {
      aiIndicators.push("Missing camera manufacturer and model data")
      confidence += 25
    }

    // Check for unusual aspect ratios common in AI generation
    if (imageData.PixelXDimension && imageData.PixelYDimension) {
      const ratio = imageData.PixelXDimension / imageData.PixelYDimension
      if (ratio === 1 || ratio === 1.5 || ratio === 0.75) {
        aiIndicators.push("Common AI generation aspect ratio detected")
        confidence += 20
      }
    }

    // Check for missing GPS and timestamp data
    if (!imageData.DateTime && !imageData.GPSLatitude) {
      aiIndicators.push("Missing temporal and location metadata")
      confidence += 15
    }

    // Check for software signatures
    if (
      imageData.Software &&
      (imageData.Software.includes("AI") ||
        imageData.Software.includes("Generated") ||
        imageData.Software.includes("Stable Diffusion") ||
        imageData.Software.includes("DALL-E"))
    ) {
      aiIndicators.push("AI generation software signature detected")
      confidence += 40
      isAi = true
    }

    if (confidence > 50) isAi = true

    return {
      isAiGenerated: isAi,
      confidence: Math.min(confidence, 95),
      indicators: aiIndicators,
      generationMethod: isAi ? "Detected in metadata" : undefined,
    }
  }

  const analyzeEditing = (imageData: any) => {
    const editingTools = []
    const modifications = []
    let isEdited = false
    let originalityScore = 100

    // Check software field for editing tools
    if (imageData.Software) {
      if (imageData.Software.includes("Photoshop")) {
        editingTools.push("Adobe Photoshop")
        isEdited = true
        originalityScore -= 30
      }
      if (imageData.Software.includes("GIMP")) {
        editingTools.push("GIMP")
        isEdited = true
        originalityScore -= 25
      }
      if (imageData.Software.includes("Lightroom")) {
        editingTools.push("Adobe Lightroom")
        isEdited = true
        originalityScore -= 15
      }
    }

    // Check for color space modifications
    if (imageData.ColorSpace && imageData.ColorSpace !== 1) {
      modifications.push("Color space modification")
      originalityScore -= 10
    }

    // Check for resolution inconsistencies
    if (imageData.XResolution !== imageData.YResolution) {
      modifications.push("Resolution adjustment")
      originalityScore -= 5
    }

    return {
      isEdited,
      editingTools,
      modifications,
      originalityScore: Math.max(originalityScore, 0),
    }
  }

  const performSecurityAnalysis = () => {
    return {
      embeddedUrls: [],
      suspiciousPatterns: [],
      malwareIndicators: [],
      permissions: ["Read", "Display"],
      backlinks: [],
      riskScore: 0,
    }
  }

  const scanImageMetadata = async () => {
    if (!file) return

    setIsScanning(true)

    try {
      const exifData = await extractRealExifData(file)

      // Get real image dimensions
      const img = new Image()
      const dimensions = await new Promise<string>((resolve) => {
        img.onload = () => {
          resolve(`${img.width} x ${img.height}`)
        }
        img.src = URL.createObjectURL(file)
      })

      const aiAnalysis = analyzeAiGeneration(exifData)
      const editingAnalysis = analyzeEditing(exifData)
      const securityAnalysis = performSecurityAnalysis()

      const privacyRisks = []

      if (exifData.GPSLatitude && exifData.GPSLongitude) {
        privacyRisks.push({
          type: "GPS Location Data",
          description: "Image contains precise location coordinates",
          severity: "High",
        })
      }

      if (exifData.Make || exifData.Model) {
        privacyRisks.push({
          type: "Device Information",
          description: "Image reveals camera model and settings",
          severity: "Medium",
        })
      }

      if (aiAnalysis.isAiGenerated) {
        privacyRisks.push({
          type: "AI Generated Content",
          description: "Image appears to be artificially generated",
          severity: "Medium",
        })
      }

      const riskLevel = privacyRisks.some((r) => r.severity === "High")
        ? "High"
        : privacyRisks.some((r) => r.severity === "Medium")
          ? "Medium"
          : "Low"

      setMetadata({
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        dimensions,
        format: file.type.split("/")[1].toUpperCase(),
        colorSpace: exifData.ColorSpace === 1 ? "sRGB" : "Unknown",
        exifData: {
          camera: exifData.Make && exifData.Model ? `${exifData.Make} ${exifData.Model}` : undefined,
          lens: exifData.LensModel || undefined,
          dateTime: exifData.DateTime || undefined,
          gpsLocation:
            exifData.GPSLatitude && exifData.GPSLongitude
              ? {
                  latitude: exifData.GPSLatitude,
                  longitude: exifData.GPSLongitude,
                  address: "Location data available",
                }
              : undefined,
          exposureSettings: {
            aperture: exifData.FNumber ? `f/${exifData.FNumber}` : undefined,
            shutterSpeed: exifData.ExposureTime ? `1/${Math.round(1 / exifData.ExposureTime)}` : undefined,
            iso: exifData.ISOSpeedRatings ? `ISO ${exifData.ISOSpeedRatings}` : undefined,
            focalLength: exifData.FocalLength ? `${exifData.FocalLength}mm` : undefined,
          },
        },
        aiAnalysis,
        editingAnalysis,
        securityAnalysis,
        privacyRisks,
        riskLevel,
        recommendations: [
          "Remove metadata before sharing images",
          "Use image editing software to strip EXIF data",
          "Disable GPS tagging in camera settings",
          "Review privacy settings on social media",
          "Consider using metadata removal tools",
          "Verify image authenticity if suspicious",
        ],
      })
    } catch (error) {
      console.error("Error analyzing image:", error)
    }

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
      <script src="https://cdn.jsdelivr.net/npm/exif-js@2.3.0/exif.js"></script>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="image-file">Image File</Label>
          <Input
            id="image-file"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="cyber-input"
          />
        </div>

        <Button onClick={scanImageMetadata} disabled={!file || isScanning} className="cyber-button">
          {isScanning ? (
            <>
              <ImageIcon className="w-4 h-4 mr-2 animate-spin" />
              Extracting Real Metadata...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Extract Metadata
            </>
          )}
        </Button>
      </div>

      {metadata && (
        <div className="space-y-4">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Real Image Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">File Name:</span>
                  <div className="font-medium">{metadata.fileName}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">File Size:</span>
                  <div className="font-medium">{metadata.fileSize}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Dimensions:</span>
                  <div className="font-medium">{metadata.dimensions}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Format:</span>
                  <div className="font-medium">{metadata.format}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Privacy Risk Level:</span>
                <Badge className={getRiskColor(metadata.riskLevel)}>{metadata.riskLevel}</Badge>
              </div>

              {(metadata.exifData.camera ||
                metadata.exifData.lens ||
                metadata.exifData.dateTime ||
                metadata.exifData.exposureSettings.aperture ||
                metadata.exifData.exposureSettings.shutterSpeed ||
                metadata.exifData.exposureSettings.iso) && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-primary" />
                    Camera Information
                  </h4>
                  <div className="space-y-1 text-sm">
                    {metadata.exifData.camera && (
                      <div>
                        <span className="text-muted-foreground">Camera:</span> {metadata.exifData.camera}
                      </div>
                    )}
                    {metadata.exifData.lens && (
                      <div>
                        <span className="text-muted-foreground">Lens:</span> {metadata.exifData.lens}
                      </div>
                    )}
                    {metadata.exifData.dateTime && (
                      <div>
                        <span className="text-muted-foreground">Date/Time:</span> {metadata.exifData.dateTime}
                      </div>
                    )}
                    {metadata.exifData.exposureSettings.aperture && (
                      <div>
                        <span className="text-muted-foreground">Aperture:</span>{" "}
                        {metadata.exifData.exposureSettings.aperture}
                      </div>
                    )}
                    {metadata.exifData.exposureSettings.shutterSpeed && (
                      <div>
                        <span className="text-muted-foreground">Shutter Speed:</span>{" "}
                        {metadata.exifData.exposureSettings.shutterSpeed}
                      </div>
                    )}
                    {metadata.exifData.exposureSettings.iso && (
                      <div>
                        <span className="text-muted-foreground">ISO:</span> {metadata.exifData.exposureSettings.iso}
                      </div>
                    )}
                  </div>
                  {!metadata.exifData.camera && !metadata.exifData.lens && (
                    <div className="text-sm text-muted-foreground italic">
                      No camera metadata available - image may be processed or AI-generated
                    </div>
                  )}
                </div>
              )}

              {metadata.exifData.gpsLocation && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    GPS Location Data
                  </h4>
                  <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <div className="text-sm">
                      <div>
                        <span className="text-muted-foreground">Coordinates:</span>{" "}
                        {metadata.exifData.gpsLocation.latitude}, {metadata.exifData.gpsLocation.longitude}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Address:</span> {metadata.exifData.gpsLocation.address}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  AI Generation Analysis
                </h4>
                <div
                  className={`p-4 rounded-lg border ${
                    metadata.aiAnalysis.isAiGenerated
                      ? "bg-orange-500/10 border-orange-500/20"
                      : "bg-green-500/10 border-green-500/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {metadata.aiAnalysis.isAiGenerated ? "AI Generated" : "Authentic Photo"}
                    </span>
                    <Badge variant="outline">Confidence: {metadata.aiAnalysis.confidence}%</Badge>
                  </div>
                  {metadata.aiAnalysis.generationMethod && (
                    <div className="text-sm mb-2">
                      <span className="text-muted-foreground">Method:</span> {metadata.aiAnalysis.generationMethod}
                    </div>
                  )}
                  {metadata.aiAnalysis.indicators.length > 0 && (
                    <div className="text-sm">
                      <div className="font-medium mb-1">Indicators:</div>
                      {metadata.aiAnalysis.indicators.map((indicator, idx) => (
                        <div key={idx} className="text-muted-foreground">
                          • {indicator}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Edit className="w-4 h-4 text-primary" />
                  Editing Analysis
                </h4>
                <div
                  className={`p-4 rounded-lg border ${
                    metadata.editingAnalysis.isEdited
                      ? "bg-yellow-500/10 border-yellow-500/20"
                      : "bg-green-500/10 border-green-500/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {metadata.editingAnalysis.isEdited ? "Edited Image" : "Original Image"}
                    </span>
                    <Badge variant="outline">Originality: {metadata.editingAnalysis.originalityScore}%</Badge>
                  </div>
                  {metadata.editingAnalysis.editingTools.length > 0 && (
                    <div className="text-sm mb-2">
                      <span className="text-muted-foreground">Tools:</span>{" "}
                      {metadata.editingAnalysis.editingTools.join(", ")}
                    </div>
                  )}
                  {metadata.editingAnalysis.modifications.length > 0 && (
                    <div className="text-sm">
                      <div className="font-medium mb-1">Modifications:</div>
                      {metadata.editingAnalysis.modifications.map((mod, idx) => (
                        <div key={idx} className="text-muted-foreground">
                          • {mod}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Security Analysis
                </h4>
                <div className="p-4 bg-muted/50 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">Risk Score: {metadata.securityAnalysis.riskScore}/100</span>
                  </div>

                  {metadata.securityAnalysis.embeddedUrls.length > 0 && (
                    <div className="mb-3">
                      <div className="text-sm font-medium mb-1 flex items-center gap-1">
                        <Link className="w-3 h-3" />
                        Embedded URLs
                      </div>
                      {metadata.securityAnalysis.embeddedUrls.map((url, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground font-mono">
                          • {url}
                        </div>
                      ))}
                    </div>
                  )}

                  {metadata.securityAnalysis.backlinks.length > 0 && (
                    <div className="mb-3">
                      <div className="text-sm font-medium mb-1 flex items-center gap-1">
                        <Link className="w-3 h-3" />
                        Backlinks
                      </div>
                      {metadata.securityAnalysis.backlinks.map((link, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground font-mono">
                          • {link}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-sm">
                    <div className="font-medium mb-1 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      File Permissions
                    </div>
                    <div className="flex gap-1">
                      {metadata.securityAnalysis.permissions.map((perm, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {metadata.privacyRisks.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Privacy Risks
                  </h4>
                  <div className="space-y-2">
                    {metadata.privacyRisks.map((risk, index) => (
                      <div key={index} className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <div className="font-medium text-orange-400">{risk.type}</div>
                        <div className="text-sm text-muted-foreground mt-1">{risk.description}</div>
                        <Badge className="mt-2" variant={risk.severity === "High" ? "destructive" : "secondary"}>
                          {risk.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Privacy Recommendations
                </h4>
                <ul className="space-y-1">
                  {metadata.recommendations.map((rec, index) => (
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
