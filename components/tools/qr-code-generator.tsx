"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QrCode, Download, Copy, CheckCircle } from "lucide-react"

interface QRCodeOptions {
  text: string
  size: number
  errorCorrection: "L" | "M" | "Q" | "H"
  format: "PNG" | "SVG"
}

export default function QRCodeGenerator() {
  const [options, setOptions] = useState<QRCodeOptions>({
    text: "",
    size: 256,
    errorCorrection: "M",
    format: "PNG",
  })
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateQRCode = async () => {
    if (!options.text) return

    setIsGenerating(true)

    // Simulate QR code generation using a public API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Using QR Server API for demonstration
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${options.size}x${options.size}&data=${encodeURIComponent(options.text)}&ecc=${options.errorCorrection}`

    setQrCodeUrl(qrUrl)
    setIsGenerating(false)
  }

  const downloadQRCode = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `qrcode.${options.format.toLowerCase()}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const copyToClipboard = async () => {
    if (!qrCodeUrl) return

    try {
      await navigator.clipboard.writeText(qrCodeUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="qr-text">Text or URL</Label>
          <Textarea
            id="qr-text"
            placeholder="Enter text, URL, or data to encode"
            value={options.text}
            onChange={(e) => setOptions({ ...options, text: e.target.value })}
            className="cyber-input min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="qr-size">Size (pixels)</Label>
            <Input
              id="qr-size"
              type="number"
              min="128"
              max="1024"
              step="32"
              value={options.size}
              onChange={(e) => setOptions({ ...options, size: Number.parseInt(e.target.value) || 256 })}
              className="cyber-input"
            />
          </div>

          <div>
            <Label htmlFor="error-correction">Error Correction</Label>
            <Select
              value={options.errorCorrection}
              onValueChange={(value: "L" | "M" | "Q" | "H") => setOptions({ ...options, errorCorrection: value })}
            >
              <SelectTrigger className="cyber-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">Low (7%)</SelectItem>
                <SelectItem value="M">Medium (15%)</SelectItem>
                <SelectItem value="Q">Quartile (25%)</SelectItem>
                <SelectItem value="H">High (30%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={generateQRCode} disabled={!options.text || isGenerating} className="cyber-button">
          {isGenerating ? (
            <>
              <QrCode className="w-4 h-4 mr-2 animate-spin" />
              Generating QR Code...
            </>
          ) : (
            <>
              <QrCode className="w-4 h-4 mr-2" />
              Generate QR Code
            </>
          )}
        </Button>
      </div>

      {qrCodeUrl && (
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-primary" />
              Generated QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-lg">
                <img
                  src={qrCodeUrl || "/placeholder.svg"}
                  alt="Generated QR Code"
                  className="max-w-full h-auto"
                  style={{ width: options.size, height: options.size }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Size:</span>
                <div className="font-medium">
                  {options.size} x {options.size} px
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Error Correction:</span>
                <div className="font-medium">{options.errorCorrection}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={downloadQRCode} variant="outline" className="flex-1 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={copyToClipboard} variant="outline" className="flex-1 bg-transparent">
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy URL
                  </>
                )}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              <strong>Encoded Data:</strong>{" "}
              {options.text.length > 100 ? `${options.text.substring(0, 100)}...` : options.text}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
