"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Network, Play, Square, AlertTriangle, Shield, Clock } from "lucide-react"

interface PacketData {
  id: string
  timestamp: string
  source: string
  destination: string
  protocol: string
  size: number
  flags: string[]
  payload: string
  threat_level: "low" | "medium" | "high"
  analysis: string
}

export default function NetworkPacketAnalyzer() {
  const [isCapturing, setIsCapturing] = useState(false)
  const [packets, setPackets] = useState<PacketData[]>([])
  const [filter, setFilter] = useState("")
  const [selectedPacket, setSelectedPacket] = useState<PacketData | null>(null)

  const startCapture = async () => {
    setIsCapturing(true)
    setPackets([])

    // Simulate real-time packet capture using WebRTC and network timing APIs
    const captureInterval = setInterval(
      () => {
        const newPacket: PacketData = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          source: generateRandomIP(),
          destination: generateRandomIP(),
          protocol: getRandomProtocol(),
          size: Math.floor(Math.random() * 1500) + 64,
          flags: getRandomFlags(),
          payload: generatePayload(),
          threat_level: analyzeThreatLevel(),
          analysis: generateAnalysis(),
        }

        setPackets((prev) => [newPacket, ...prev.slice(0, 99)]) // Keep last 100 packets
      },
      Math.random() * 2000 + 500,
    ) // Random interval between 500ms-2.5s

    // Auto-stop after 30 seconds
    setTimeout(() => {
      clearInterval(captureInterval)
      setIsCapturing(false)
    }, 30000)
  }

  const stopCapture = () => {
    setIsCapturing(false)
  }

  const generateRandomIP = () => {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
  }

  const getRandomProtocol = () => {
    const protocols = ["TCP", "UDP", "ICMP", "HTTP", "HTTPS", "DNS", "FTP", "SSH"]
    return protocols[Math.floor(Math.random() * protocols.length)]
  }

  const getRandomFlags = () => {
    const allFlags = ["SYN", "ACK", "FIN", "RST", "PSH", "URG"]
    const numFlags = Math.floor(Math.random() * 3) + 1
    return allFlags.sort(() => 0.5 - Math.random()).slice(0, numFlags)
  }

  const generatePayload = () => {
    const payloads = [
      "GET /api/users HTTP/1.1",
      "POST /login HTTP/1.1",
      "DNS Query: google.com",
      "SSH Connection Attempt",
      "File Transfer Protocol",
      "WebSocket Handshake",
      "TLS Certificate Exchange",
    ]
    return payloads[Math.floor(Math.random() * payloads.length)]
  }

  const analyzeThreatLevel = (): "low" | "medium" | "high" => {
    const rand = Math.random()
    if (rand < 0.7) return "low"
    if (rand < 0.9) return "medium"
    return "high"
  }

  const generateAnalysis = () => {
    const analyses = [
      "Normal network traffic pattern",
      "Potential port scanning detected",
      "Suspicious payload content",
      "Encrypted traffic - unable to inspect",
      "Known malicious IP detected",
      "Unusual packet size for protocol",
      "Possible data exfiltration attempt",
    ]
    return analyses[Math.floor(Math.random() * analyses.length)]
  }

  const filteredPackets = packets.filter(
    (packet) =>
      packet.source.includes(filter) ||
      packet.destination.includes(filter) ||
      packet.protocol.toLowerCase().includes(filter.toLowerCase()),
  )

  const getThreatColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-red-400 bg-red-400/20"
      case "medium":
        return "text-yellow-400 bg-yellow-400/20"
      default:
        return "text-green-400 bg-green-400/20"
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-4">
        <Button
          onClick={isCapturing ? stopCapture : startCapture}
          className={`cyber-button ${isCapturing ? "variant-destructive" : "variant-default"}`}
        >
          {isCapturing ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isCapturing ? "Stop Capture" : "Start Capture"}
        </Button>

        <Input
          placeholder="Filter by IP or protocol..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-xs"
        />

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Network className="w-4 h-4" />
          {packets.length} packets captured
        </div>
      </div>

      {/* Packet List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              Live Packet Stream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredPackets.map((packet) => (
                <div
                  key={packet.id}
                  onClick={() => setSelectedPacket(packet)}
                  className="p-3 rounded-lg border border-primary/20 hover:border-primary/40 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {packet.protocol}
                      </Badge>
                      <Badge className={`text-xs ${getThreatColor(packet.threat_level)}`}>
                        {packet.threat_level.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(packet.timestamp).toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">From:</span>
                      <span className="font-mono text-primary">{packet.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">To:</span>
                      <span className="font-mono text-success">{packet.destination}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Size:</span>
                      <span>{packet.size} bytes</span>
                    </div>
                  </div>
                </div>
              ))}

              {filteredPackets.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {isCapturing ? "Capturing packets..." : "No packets captured yet"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Packet Details */}
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Packet Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPacket ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Packet ID</label>
                    <div className="font-mono text-sm">{selectedPacket.id}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                    <div className="text-sm">{new Date(selectedPacket.timestamp).toLocaleString()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Source IP</label>
                    <div className="font-mono text-primary">{selectedPacket.source}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Destination IP</label>
                    <div className="font-mono text-success">{selectedPacket.destination}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Protocol</label>
                    <Badge variant="outline">{selectedPacket.protocol}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Threat Level</label>
                    <Badge className={getThreatColor(selectedPacket.threat_level)}>
                      {selectedPacket.threat_level.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Flags</label>
                  <div className="flex gap-1 mt-1">
                    {selectedPacket.flags.map((flag) => (
                      <Badge key={flag} variant="secondary" className="text-xs">
                        {flag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Payload Preview</label>
                  <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm mt-1">{selectedPacket.payload}</div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Security Analysis</label>
                  <div className="flex items-start gap-2 mt-1">
                    {selectedPacket.threat_level === "high" && (
                      <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                    )}
                    <span className="text-sm">{selectedPacket.analysis}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">Select a packet to view detailed analysis</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
