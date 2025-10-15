"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Shield, Key, Smartphone, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [masterPassword, setMasterPassword] = useState<string | null>(null)
  const [isPasswordSet, setIsPasswordSet] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const storedPassword = localStorage.getItem("mobicure_master_password")
    const stored2FA = localStorage.getItem("mobicure_2fa_enabled")

    if (storedPassword) {
      setMasterPassword(storedPassword)
      setIsPasswordSet(true)
    }

    if (stored2FA === "true") {
      setTwoFactorEnabled(true)
    }
  }, [])

  const handlePasswordUpdate = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (isPasswordSet && !currentPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password",
        variant: "destructive",
      })
      return
    }

    if (isPasswordSet && currentPassword !== masterPassword) {
      toast({
        title: "Error",
        description: "Current password is incorrect",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)

    setTimeout(() => {
      localStorage.setItem("mobicure_master_password", newPassword)
      setMasterPassword(newPassword)
      setIsPasswordSet(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setIsUpdating(false)

      toast({
        title: "Success",
        description: isPasswordSet ? "Master password updated successfully" : "Master password set successfully",
      })
    }, 1500)
  }

  const handleTwoFactorToggle = (enabled: boolean) => {
    localStorage.setItem("mobicure_2fa_enabled", enabled.toString())
    setTwoFactorEnabled(enabled)
    toast({
      title: enabled ? "2FA Enabled" : "2FA Disabled",
      description: enabled
        ? "Two-factor authentication has been enabled"
        : "Two-factor authentication has been disabled",
    })
  }

  return (
    <div className="space-y-6">
      {/* Master Password */}
      <Card className="bg-card/30 backdrop-blur-sm neon-border">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Key className="h-6 w-6 text-primary glow-primary" />
            <CardTitle className="text-xl font-bold text-primary font-[var(--font-heading)]">
              {isPasswordSet ? "Update Master Password" : "Set Master Password"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPasswordSet && (
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-sm font-medium">
                Current Password
              </Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-muted/20 border-primary/20"
                placeholder="Enter your current password"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-sm font-medium">
              {isPasswordSet ? "New Password" : "Master Password"}
            </Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-muted/20 border-primary/20"
              placeholder="Enter a strong password (min 8 characters)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium">
              Confirm Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-muted/20 border-primary/20"
              placeholder="Confirm your password"
            />
          </div>

          <Button
            onClick={handlePasswordUpdate}
            disabled={isUpdating}
            className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 hover:border-primary/50"
          >
            {isUpdating ? "Updating..." : isPasswordSet ? "Update Master Password" : "Set Master Password"}
          </Button>

          <div
            className={`p-3 rounded-lg border ${isPasswordSet ? "bg-success/10 border-success/20" : "bg-warning/10 border-warning/20"}`}
          >
            <p className={`text-sm ${isPasswordSet ? "text-success" : "text-warning"}`}>
              {isPasswordSet ? "✓ Master password is configured" : "⚠ Master password not set"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="bg-card/30 backdrop-blur-sm neon-border">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Smartphone className="h-6 w-6 text-success glow-success" />
            <CardTitle className="text-xl font-bold text-success font-[var(--font-heading)]">
              Two-Factor Authentication
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Enable 2FA</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security to your vault</p>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={handleTwoFactorToggle} />
          </div>

          {twoFactorEnabled && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-success">2FA Active</span>
              </div>
              <p className="text-xs text-muted-foreground">Your vault is protected with two-factor authentication</p>
            </div>
          )}

          {!twoFactorEnabled && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">2FA Disabled</span>
              </div>
              <p className="text-xs text-muted-foreground">Enable 2FA for enhanced security protection</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
