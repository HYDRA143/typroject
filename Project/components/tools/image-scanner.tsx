"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Scan, CheckCircle, XCircle } from "lucide-react"

export function ImageScanner() {
  const [file, setFile] = useState<File | null>(null)
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleScan = async () => {
    if (!file) return

    setScanning(true)
    // Simulate scanning
    setTimeout(() => {
      setResults({
        filename: file.name,
        size: file.size,
        type: file.type,
        threats: Math.random() > 0.7 ? ["Suspicious metadata", "Embedded malware"] : [],
        metadata: {
          dimensions: "1920x1080",
          created: "2024-01-15",
          camera: "iPhone 15 Pro",
        },
        safe: Math.random() > 0.3,
      })
      setScanning(false)
    }, 3000)
  }

  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Scan className="h-5 w-5 text-primary" />
          <span>Image Security Scanner</span>
        </CardTitle>
        <CardDescription>Analyze images for malware, suspicious metadata, and security threats</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="max-w-xs mx-auto"
          />
          <p className="text-sm text-muted-foreground mt-2">Upload JPG, PNG, GIF, or other image files</p>
        </div>

        {file && (
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
            <span className="text-sm">{file.name}</span>
            <Button onClick={handleScan} disabled={scanning} className="cyber-button">
              {scanning ? "Scanning..." : "Scan Image"}
            </Button>
          </div>
        )}

        {results && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {results.safe ? (
                <CheckCircle className="h-5 w-5 text-success" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <span className="font-medium">{results.safe ? "Image appears safe" : "Threats detected"}</span>
            </div>

            {results.threats.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-destructive">Detected Threats:</h4>
                {results.threats.map((threat: string, index: number) => (
                  <Badge key={index} variant="destructive" className="mr-2">
                    {threat}
                  </Badge>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">File Size:</span>
                <span className="ml-2">{(results.size / 1024).toFixed(1)} KB</span>
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2">{results.type}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Dimensions:</span>
                <span className="ml-2">{results.metadata.dimensions}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2">{results.metadata.created}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
