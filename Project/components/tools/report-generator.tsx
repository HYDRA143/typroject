"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Share2 } from "lucide-react"

interface SecurityReport {
  id: string
  title: string
  date: string
  summary: {
    totalScans: number
    threatsFound: number
    riskLevel: "Low" | "Medium" | "High" | "Critical"
    recommendations: number
  }
  sections: {
    name: string
    status: "Passed" | "Warning" | "Failed"
    details: string
  }[]
}

export function ReportGenerator() {
  const [reports, setReports] = useState<SecurityReport[]>([
    {
      id: "RPT-001",
      title: "Comprehensive Security Audit",
      date: new Date().toISOString().split("T")[0],
      summary: {
        totalScans: 8,
        threatsFound: 3,
        riskLevel: "Medium",
        recommendations: 12,
      },
      sections: [
        {
          name: "Network Security",
          status: "Warning",
          details: "2 open ports detected, firewall configuration needs review",
        },
        { name: "URL Security", status: "Passed", details: "All scanned URLs are secure with valid SSL certificates" },
        {
          name: "File Analysis",
          status: "Failed",
          details: "1 suspicious file detected with potential malware signatures",
        },
        {
          name: "Email Security",
          status: "Warning",
          details: "Phishing indicators found in recent email communications",
        },
        { name: "System Monitor", status: "Passed", details: "System performance within normal parameters" },
        { name: "Dark Web Monitor", status: "Failed", details: "Email found in 2 data breach databases" },
        { name: "Privacy Vault", status: "Passed", details: "All stored credentials properly encrypted" },
        {
          name: "Breach Checker",
          status: "Warning",
          details: "Historical breaches detected, password updates recommended",
        },
      ],
    },
  ])

  const [selectedReport, setSelectedReport] = useState<SecurityReport | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateNewReport = async () => {
    setIsGenerating(true)

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const newReport: SecurityReport = {
      id: `RPT-${String(reports.length + 1).padStart(3, "0")}`,
      title: `Security Assessment - ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString().split("T")[0],
      summary: {
        totalScans: Math.floor(Math.random() * 10) + 5,
        threatsFound: Math.floor(Math.random() * 5),
        riskLevel: ["Low", "Medium", "High", "Critical"][Math.floor(Math.random() * 4)] as any,
        recommendations: Math.floor(Math.random() * 15) + 5,
      },
      sections: [
        {
          name: "Network Security",
          status: Math.random() > 0.7 ? "Failed" : Math.random() > 0.4 ? "Warning" : "Passed",
          details: "Network analysis completed",
        },
        {
          name: "URL Security",
          status: Math.random() > 0.8 ? "Failed" : Math.random() > 0.5 ? "Warning" : "Passed",
          details: "URL threat analysis completed",
        },
        {
          name: "File Analysis",
          status: Math.random() > 0.7 ? "Failed" : Math.random() > 0.4 ? "Warning" : "Passed",
          details: "File security scan completed",
        },
        {
          name: "Email Security",
          status: Math.random() > 0.6 ? "Failed" : Math.random() > 0.3 ? "Warning" : "Passed",
          details: "Email phishing analysis completed",
        },
        {
          name: "System Monitor",
          status: Math.random() > 0.8 ? "Failed" : Math.random() > 0.5 ? "Warning" : "Passed",
          details: "System performance analysis completed",
        },
        {
          name: "Dark Web Monitor",
          status: Math.random() > 0.5 ? "Failed" : Math.random() > 0.3 ? "Warning" : "Passed",
          details: "Dark web exposure scan completed",
        },
        {
          name: "Privacy Vault",
          status: Math.random() > 0.9 ? "Failed" : Math.random() > 0.7 ? "Warning" : "Passed",
          details: "Vault security verification completed",
        },
        {
          name: "Breach Checker",
          status: Math.random() > 0.4 ? "Failed" : Math.random() > 0.2 ? "Warning" : "Passed",
          details: "Data breach analysis completed",
        },
      ].map((section) => ({
        ...section,
        status: section.status as "Passed" | "Warning" | "Failed",
      })),
    }

    setReports([newReport, ...reports])
    setSelectedReport(newReport)
    setIsGenerating(false)
  }

  const exportReport = (format: "pdf" | "html" | "txt") => {
    if (!selectedReport) return

    // Simulate export functionality
    const reportContent = `
GUARDIANAI SECURITY REPORT
${selectedReport.title}
Generated: ${selectedReport.date}

EXECUTIVE SUMMARY
Total Scans: ${selectedReport.summary.totalScans}
Threats Found: ${selectedReport.summary.threatsFound}
Risk Level: ${selectedReport.summary.riskLevel}
Recommendations: ${selectedReport.summary.recommendations}

DETAILED FINDINGS
${selectedReport.sections.map((section) => `${section.name}: ${section.status}\n${section.details}`).join("\n\n")}
    `

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedReport.id}_security_report.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Passed":
        return "text-success"
      case "Warning":
        return "text-yellow-500"
      case "Failed":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Passed":
        return "✓"
      case "Warning":
        return "⚠"
      case "Failed":
        return "✗"
      default:
        return "?"
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low":
        return "text-success"
      case "Medium":
        return "text-yellow-500"
      case "High":
        return "text-orange-500"
      case "Critical":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Security Report Generator
            </div>
            <Button onClick={generateNewReport} disabled={isGenerating} className="cyber-button">
              {isGenerating ? "Generating..." : "Generate New Report"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Report List */}
            <div>
              <h3 className="font-semibold text-primary mb-4">Available Reports</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {reports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`w-full text-left p-3 rounded-lg transition-all border ${
                      selectedReport?.id === report.id
                        ? "bg-primary/20 border-primary/50 glow-primary"
                        : "hover:bg-primary/10 border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{report.id}</span>
                      <span className={`text-xs font-semibold ${getRiskColor(report.summary.riskLevel)}`}>
                        {report.summary.riskLevel}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{report.title}</p>
                    <p className="text-xs text-muted-foreground">{report.date}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Report Preview */}
            <div>
              {selectedReport ? (
                <div className="space-y-4">
                  <div className="cyber-card p-4">
                    <h3 className="font-semibold text-primary mb-2">{selectedReport.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">Report ID: {selectedReport.id}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Total Scans</p>
                        <p className="text-xl font-bold">{selectedReport.summary.totalScans}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Threats Found</p>
                        <p className="text-xl font-bold text-red-500">{selectedReport.summary.threatsFound}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {selectedReport.sections.map((section, index) => (
                        <div key={index} className="flex items-center justify-between p-2 cyber-card">
                          <span className="text-sm">{section.name}</span>
                          <span className={`text-sm font-semibold ${getStatusColor(section.status)}`}>
                            {getStatusIcon(section.status)} {section.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Export Options */}
                  <div className="cyber-card p-4">
                    <h4 className="font-semibold text-success mb-3">Export Options</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        onClick={() => exportReport("pdf")}
                        variant="outline"
                        size="sm"
                        className="cyber-button-outline"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button
                        onClick={() => exportReport("html")}
                        variant="outline"
                        size="sm"
                        className="cyber-button-outline"
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        HTML
                      </Button>
                      <Button
                        onClick={() => exportReport("txt")}
                        variant="outline"
                        size="sm"
                        className="cyber-button-outline"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        TXT
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="cyber-card p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Select a report to view details</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
