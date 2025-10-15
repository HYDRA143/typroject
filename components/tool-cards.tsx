"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Key, Globe, ImageIcon, Wifi, Mail, FileSearch, Shield, Database, Smartphone } from "lucide-react"
import Link from "next/link"
import { CyberButton } from "@/components/ui/cyber-button"
import { CyberCard } from "@/components/ui/cyber-card"

export function ToolCards() {
  const tools = [
    {
      title: "Password Generator",
      description: "Generate secure, cryptographically strong passwords",
      icon: Key,
      category: "Active Search",
      color: "text-primary",
      href: "/tools#password-generator",
      variant: "hologram" as const,
    },
    {
      title: "URL Security Scanner",
      description: "Advanced malicious URL detection with Google Genkit",
      icon: Globe,
      category: "Active Search",
      color: "text-primary",
      href: "/tools#url-scanner",
      variant: "matrix" as const,
    },
    {
      title: "Image Security Scanner",
      description: "Metadata extraction and threat detection in images",
      icon: ImageIcon,
      category: "Active Search",
      color: "text-primary",
      href: "/tools#image-scanner",
      variant: "circuit" as const,
    },
    {
      title: "Network Scanner",
      description: "Real-time network mapping and device monitoring",
      icon: Wifi,
      category: "Active Search",
      color: "text-primary",
      href: "/tools#network-scanner",
      variant: "default" as const,
    },
    {
      title: "Email Header Analyzer",
      description: "Analyze email headers for security threats",
      icon: Mail,
      category: "Analyzer",
      color: "text-success",
      href: "/tools#email-analyzer",
      variant: "hologram" as const,
    },
    {
      title: "Application Analyzer",
      description: "Deep application security analysis",
      icon: FileSearch,
      category: "Analyzer",
      color: "text-success",
      href: "/tools#app-analyzer",
      variant: "matrix" as const,
    },
    {
      title: "Security Auditor",
      description: "Comprehensive security vulnerability assessment",
      icon: Shield,
      category: "Audit",
      color: "text-destructive",
      href: "/tools#security-auditor",
      variant: "circuit" as const,
    },
    {
      title: "Data Breach Checker",
      description: "Check for compromised credentials and data leaks",
      icon: Database,
      category: "Checker",
      color: "text-destructive",
      href: "/tools#breach-checker",
      variant: "default" as const,
    },
    {
      title: "APK Analyzer",
      description: "Android application security analysis up to 100MB",
      icon: Smartphone,
      category: "Scanner",
      color: "text-primary",
      href: "/tools#apk-analyzer",
      variant: "hologram" as const,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-primary font-[var(--font-heading)] cyber-text">Security Tools</h2>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-primary rounded-full pulse-glow"></div>
          <span className="text-sm text-primary data-stream">All Systems Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <CyberCard key={index} variant={tool.variant} className="cursor-pointer group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <tool.icon
                  className={`h-8 w-8 ${tool.color} group-hover:scale-110 transition-transform duration-300 data-stream`}
                  style={{ minWidth: "2rem", minHeight: "2rem" }}
                />
                <span className="text-xs px-2 py-1 bg-muted/50 rounded-full text-muted-foreground neon-border">
                  {tool.category}
                </span>
              </div>
              <CardTitle className="text-lg font-bold text-foreground font-[var(--font-heading)] scan-line">
                {tool.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-sm break-words">{tool.description}</CardContent>
          </CyberCard>
        ))}
      </div>
    </div>
  )
}
