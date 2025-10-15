"use client"

import { useState } from "react"
import {
  Shield,
  Globe,
  Network,
  Mail,
  Database,
  Hash,
  FileCheck,
  Lock,
  Scan,
  Code,
  Search,
  Key,
  Smartphone,
  Archive,
  FileText,
  ImageIcon,
  QrCode,
  Camera,
} from "lucide-react"

// Import all tool components
import URLThreatScanner from "@/components/tools/url-threat-scanner"
import BrowserVulnerabilityScanner from "@/components/tools/browser-vulnerability-scanner"
import NetworkPacketAnalyzer from "@/components/tools/network-packet-analyzer"
import PhishingEmailDetector from "@/components/tools/phishing-email-detector"
import DataBreachChecker from "@/components/tools/data-breach-checker"
import MalwareHashScanner from "@/components/tools/malware-hash-scanner"
import FileIntegrityChecker from "@/components/tools/file-integrity-checker"
import SSLCertificateAnalyzer from "@/components/tools/ssl-certificate-analyzer"
import OpenPortScanner from "@/components/tools/open-port-scanner"
import SQLInjectionTester from "@/components/tools/sql-injection-tester"
import XSSVulnerabilityTester from "@/components/tools/xss-vulnerability-tester"
import DirectoryListingChecker from "@/components/tools/directory-listing-checker"
import PasswordStrengthChecker from "@/components/tools/password-strength-checker"
import APKAnalyzer from "@/components/tools/apk-analyzer"
import ZipFileScanner from "@/components/tools/zip-file-scanner"
import PDFFileScanner from "@/components/tools/pdf-file-scanner"
import ImageMetadataScanner from "@/components/tools/image-metadata-scanner"
import QRCodeGenerator from "@/components/tools/qr-code-generator"
import QRCodeScanner from "@/components/tools/qr-code-scanner"

const toolCategories = [
  {
    name: "Web Security",
    tools: [
      {
        id: "url-threat-scanner",
        name: "URL Threat Scanner",
        icon: Globe,
        description: "Analyze URLs for phishing, malware, and security threats",
      },
      {
        id: "browser-vulnerability-scanner",
        name: "Browser Vulnerability Scanner",
        icon: Shield,
        description: "Check browser versions for known security vulnerabilities",
      },
      {
        id: "ssl-certificate-analyzer",
        name: "SSL Certificate Analyzer",
        icon: Lock,
        description: "Analyze SSL/TLS certificates and security configurations",
      },
      {
        id: "sql-injection-tester",
        name: "SQL Injection Tester",
        icon: Database,
        description: "Test endpoints for SQL injection vulnerabilities",
      },
      {
        id: "xss-vulnerability-tester",
        name: "XSS Vulnerability Tester",
        icon: Code,
        description: "Detect cross-site scripting vulnerabilities",
      },
      {
        id: "directory-listing-checker",
        name: "Directory Listing Checker",
        icon: Search,
        description: "Check for exposed directory listings",
      },
    ],
  },
  {
    name: "Network Analysis",
    tools: [
      {
        id: "network-packet-analyzer",
        name: "Network Packet Analyzer",
        icon: Network,
        description: "Capture and analyze network packets for threats",
      },
      {
        id: "open-port-scanner",
        name: "Open Port Scanner",
        icon: Scan,
        description: "Scan for open ports and running services",
      },
    ],
  },
  {
    name: "File Security",
    tools: [
      {
        id: "malware-hash-scanner",
        name: "Malware Hash Scanner",
        icon: Hash,
        description: "Check file hashes against malware databases",
      },
      {
        id: "file-integrity-checker",
        name: "File Integrity Checker",
        icon: FileCheck,
        description: "Verify file integrity and digital signatures",
      },
      {
        id: "apk-analyzer",
        name: "APK Analyzer",
        icon: Smartphone,
        description: "Analyze Android APK files for security risks",
      },
      {
        id: "zip-file-scanner",
        name: "ZIP File Scanner",
        icon: Archive,
        description: "Scan ZIP archives for malicious content",
      },
      {
        id: "pdf-file-scanner",
        name: "PDF File Scanner",
        icon: FileText,
        description: "Analyze PDF files for embedded threats",
      },
      {
        id: "image-metadata-scanner",
        name: "Image Metadata Scanner",
        icon: ImageIcon,
        description: "Extract and analyze image metadata for privacy risks",
      },
    ],
  },
  {
    name: "Communication Security",
    tools: [
      {
        id: "phishing-email-detector",
        name: "Phishing Email Detector",
        icon: Mail,
        description: "Detect phishing attempts in email content",
      },
      {
        id: "data-breach-checker",
        name: "Data Breach Checker",
        icon: Database,
        description: "Check if credentials appear in known data breaches",
      },
    ],
  },
  {
    name: "Authentication & QR",
    tools: [
      {
        id: "password-strength-checker",
        name: "Password Strength Checker",
        icon: Key,
        description: "Evaluate password strength and security",
      },
      {
        id: "qr-code-generator",
        name: "QR Code Generator",
        icon: QrCode,
        description: "Generate secure QR codes with integrity checks",
      },
      {
        id: "qr-code-scanner",
        name: "QR Code Scanner",
        icon: Camera,
        description: "Scan and analyze QR codes for security threats",
      },
    ],
  },
]

export default function ToolsPage() {
  const [activeToolId, setActiveToolId] = useState<string>("url-threat-scanner")

  const renderToolComponent = (toolId: string) => {
    switch (toolId) {
      case "url-threat-scanner":
        return <URLThreatScanner />
      case "browser-vulnerability-scanner":
        return <BrowserVulnerabilityScanner />
      case "network-packet-analyzer":
        return <NetworkPacketAnalyzer />
      case "phishing-email-detector":
        return <PhishingEmailDetector />
      case "data-breach-checker":
        return <DataBreachChecker />
      case "malware-hash-scanner":
        return <MalwareHashScanner />
      case "file-integrity-checker":
        return <FileIntegrityChecker />
      case "ssl-certificate-analyzer":
        return <SSLCertificateAnalyzer />
      case "open-port-scanner":
        return <OpenPortScanner />
      case "sql-injection-tester":
        return <SQLInjectionTester />
      case "xss-vulnerability-tester":
        return <XSSVulnerabilityTester />
      case "directory-listing-checker":
        return <DirectoryListingChecker />
      case "password-strength-checker":
        return <PasswordStrengthChecker />
      case "apk-analyzer":
        return <APKAnalyzer />
      case "zip-file-scanner":
        return <ZipFileScanner />
      case "pdf-file-scanner":
        return <PDFFileScanner />
      case "image-metadata-scanner":
        return <ImageMetadataScanner />
      case "qr-code-generator":
        return <QRCodeGenerator />
      case "qr-code-scanner":
        return <QRCodeScanner />
      default:
        return <div>Tool not found</div>
    }
  }

  const activeTool = toolCategories.flatMap((category) => category.tools).find((tool) => tool.id === activeToolId)

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-card/50 backdrop-blur-sm border-r border-primary/20 min-h-screen overflow-y-auto glass-morphism">
          <div className="p-6 border-b border-primary/20">
            <h1 className="text-2xl font-black text-transparent bg-gradient-to-r from-primary via-success to-primary bg-clip-text animate-glow">
              MOBICURE ARSENAL
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {toolCategories.reduce((total, category) => total + category.tools.length, 0)} Security Tools
            </p>
          </div>

          <div className="p-4 space-y-6">
            {toolCategories.map((category) => (
              <div key={category.name}>
                <h3 className="text-sm font-semibold text-primary mb-3 px-2 animate-pulse">{category.name}</h3>
                <div className="space-y-1">
                  {category.tools.map((tool) => {
                    const Icon = tool.icon
                    return (
                      <button
                        key={tool.id}
                        onClick={() => setActiveToolId(tool.id)}
                        className={`w-full text-left p-4 rounded-xl transition-all duration-500 group relative overflow-hidden glass-card ${
                          activeToolId === tool.id
                            ? "glass-card-active animate-glow-pulse"
                            : "hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/30"
                        }`}
                      >
                        {/* Enhanced glass shine effect */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-transform duration-1000 ${
                            activeToolId === tool.id
                              ? "translate-x-full animate-shine"
                              : "-translate-x-full group-hover:translate-x-full"
                          }`}
                        />

                        {/* Rotating glow border */}
                        <div
                          className={`absolute inset-0 rounded-xl transition-all duration-500 ${
                            activeToolId === tool.id
                              ? "bg-gradient-to-r from-primary/30 via-success/30 to-primary/30 animate-rotate-glow"
                              : "group-hover:bg-gradient-to-r group-hover:from-primary/20 group-hover:via-success/20 group-hover:to-primary/20"
                          }`}
                          style={{
                            background:
                              activeToolId === tool.id
                                ? "conic-gradient(from 0deg, rgba(0, 255, 231, 0.3), rgba(63, 255, 125, 0.3), rgba(0, 255, 231, 0.3))"
                                : undefined,
                            animation: activeToolId === tool.id ? "rotate-glow 3s linear infinite" : undefined,
                          }}
                        />

                        <div className="flex items-start gap-4 relative z-10">
                          <div
                            className={`p-2 rounded-lg transition-all duration-500 glass-icon ${
                              activeToolId === tool.id
                                ? "glass-icon-active animate-pulse-glow"
                                : "group-hover:glass-icon-hover"
                            }`}
                          >
                            <Icon
                              className={`w-6 h-6 transition-all duration-500 ${
                                activeToolId === tool.id
                                  ? "text-primary animate-glow-rotate"
                                  : "text-muted-foreground group-hover:text-primary group-hover:animate-pulse"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-bold text-base transition-all duration-500 ${
                                activeToolId === tool.id
                                  ? "text-primary animate-text-glow"
                                  : "text-foreground group-hover:text-primary"
                              }`}
                            >
                              {tool.name}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1 line-clamp-2 group-hover:text-muted-foreground/80 transition-all duration-300">
                              {tool.description}
                            </div>
                          </div>
                        </div>

                        {/* Enhanced active indicator */}
                        {activeToolId === tool.id && (
                          <div className="absolute right-3 top-3 w-3 h-3 bg-primary rounded-full animate-ping">
                            <div className="absolute inset-0 w-3 h-3 bg-primary rounded-full animate-pulse" />
                          </div>
                        )}

                        {/* Floating particles effect */}
                        {activeToolId === tool.id && (
                          <>
                            <div className="absolute top-2 left-2 w-1 h-1 bg-primary/60 rounded-full animate-float-1" />
                            <div className="absolute top-4 right-8 w-1 h-1 bg-success/60 rounded-full animate-float-2" />
                            <div className="absolute bottom-3 left-8 w-1 h-1 bg-primary/60 rounded-full animate-float-3" />
                          </>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Header Section */}
          <div className="p-8 border-b border-primary/20 bg-card/30 backdrop-blur-sm">
            <div className="flex items-center gap-6">
              {activeTool && (
                <>
                  <div className="p-4 rounded-xl glass-card glass-card-active animate-glow-pulse">
                    <activeTool.icon className="w-8 h-8 text-primary animate-glow-rotate" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-primary via-success to-primary bg-clip-text animate-glow">
                      {activeTool.name}
                    </h2>
                    <p className="text-lg text-muted-foreground mt-2">{activeTool.description}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tool Content */}
          <div className="flex-1 overflow-auto">
            <div className="h-full w-full">
              <div className="min-h-full w-full bg-gradient-to-br from-background via-card/20 to-background">
                <div className="p-8 h-full">
                  <div className="h-full w-full rounded-3xl border border-primary/40 shadow-2xl shadow-primary/30 backdrop-blur-xl glass-morphism-main-large relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-success/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    <div className="absolute top-12 left-12 w-3 h-3 bg-primary/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float-1 transition-opacity duration-500" />
                    <div className="absolute top-20 right-16 w-2 h-2 bg-success/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float-2 transition-opacity duration-500" />
                    <div className="absolute bottom-16 left-20 w-2.5 h-2.5 bg-primary/50 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float-3 transition-opacity duration-500" />
                    <div className="absolute bottom-12 right-12 w-2 h-2 bg-success/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float-1 transition-opacity duration-500" />

                    <div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                      style={{
                        background:
                          "conic-gradient(from 0deg, rgba(0, 255, 231, 0.2), rgba(63, 255, 125, 0.2), rgba(0, 255, 231, 0.2))",
                        animation: "rotate-glow 8s linear infinite",
                      }}
                    />

                    <div className="relative z-10 h-full p-12 rounded-3xl bg-gradient-to-br from-card/30 via-card/20 to-card/30 backdrop-blur-sm border border-primary/20">
                      <div className="h-full overflow-auto custom-scrollbar">
                        <div className="min-h-full">{renderToolComponent(activeToolId)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
