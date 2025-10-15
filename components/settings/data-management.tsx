"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Trash2, AlertTriangle, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function DataManagement() {
  const [isExporting, setIsExporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const { toast } = useToast()

  const handleExportData = async () => {
    setIsExporting(true)

    // Simulate data export
    setTimeout(() => {
      // Create mock export data
      const exportData = {
        version: "1.0.0",
        exportDate: new Date().toISOString(),
        vaultItems: [
          {
            id: "1",
            title: "Gmail Account",
            category: "Login",
            encrypted: true,
          },
          // Add more mock data as needed
        ],
        settings: {
          darkMode: true,
          notifications: true,
          twoFactor: false,
        },
      }

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `mobicure-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setIsExporting(false)
      toast({
        title: "Export Complete",
        description: "Your data has been exported successfully",
      })
    }, 2000)
  }

  const handleClearData = async () => {
    setIsClearing(true)

    // Simulate data clearing
    setTimeout(() => {
      setIsClearing(false)
      toast({
        title: "Data Cleared",
        description: "All application data has been removed",
        variant: "destructive",
      })
    }, 1500)
  }

  return (
    <Card className="bg-card/30 backdrop-blur-sm neon-border">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Database className="h-6 w-6 text-primary glow-primary" />
          <CardTitle className="text-xl font-bold text-primary font-[var(--font-heading)]">Data Management</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Data */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Download className="h-5 w-5 text-success" />
            <div>
              <p className="text-sm font-medium">Export Data</p>
              <p className="text-xs text-muted-foreground">Download all your vault data and settings</p>
            </div>
          </div>
          <Button
            onClick={handleExportData}
            disabled={isExporting}
            className="w-full bg-success/10 hover:bg-success/20 text-success border border-success/30 hover:border-success/50"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export Data"}
          </Button>
        </div>

        {/* Clear Data */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Trash2 className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-sm font-medium">Clear All Data</p>
              <p className="text-xs text-muted-foreground">Permanently remove all application data</p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-destructive/30 hover:border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card/95 backdrop-blur-md border-destructive/20">
              <AlertDialogHeader>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                  <AlertDialogTitle className="text-destructive">Clear All Data</AlertDialogTitle>
                </div>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your vault items, settings, and
                  application data from this device.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-muted/30 hover:border-muted/50">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearData}
                  disabled={isClearing}
                  className="bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/30 hover:border-destructive/50"
                >
                  {isClearing ? "Clearing..." : "Clear All Data"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
