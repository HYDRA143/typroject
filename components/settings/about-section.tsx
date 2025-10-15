"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info, Shield, Calendar, Cpu } from "lucide-react"

export function AboutSection() {
  const appInfo = {
    version: "1.0.0",
    build: "20241201",
    lastUpdated: "2024-12-01T10:30:00Z",
    securityStatus: "AES-256 Encrypted",
    lastScan: "2024-12-01T09:15:00Z",
  }

  return (
    <Card className="bg-card/30 backdrop-blur-sm neon-border">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Info className="h-6 w-6 text-primary glow-primary" />
          <CardTitle className="text-xl font-bold text-primary font-[var(--font-heading)]">About MOBICURE</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Version Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Cpu className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Version</span>
            </div>
            <p className="text-lg font-bold text-primary">{appInfo.version}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Cpu className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Build</span>
            </div>
            <p className="text-lg font-bold text-primary">{appInfo.build}</p>
          </div>
        </div>

        {/* Last Updated */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Last Updated</span>
          </div>
          <p className="text-sm text-muted-foreground">{new Date(appInfo.lastUpdated).toLocaleString()}</p>
        </div>

        {/* Security Status */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-success" />
            <span className="text-sm font-medium">Security Status</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Encryption</span>
              <Badge className="bg-success/20 text-success border-success/30">{appInfo.securityStatus}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Security Scan</span>
              <span className="text-sm text-success">{new Date(appInfo.lastScan).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-success rounded-full pulse-glow"></div>
                <span className="text-sm text-success font-medium">SECURE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="pt-4 border-t border-muted/20">
          <p className="text-xs text-muted-foreground text-center">
            MOBICURE Cybersecurity Command Center
            <br />
            Advanced threat detection and security monitoring platform
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
