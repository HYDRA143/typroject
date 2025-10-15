"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Key, Shield, AlertTriangle, CheckCircle, Eye, EyeOff } from "lucide-react"

interface PasswordAnalysis {
  password: string
  strength: "Very Weak" | "Weak" | "Fair" | "Good" | "Strong" | "Very Strong"
  score: number
  criteria: {
    length: boolean
    uppercase: boolean
    lowercase: boolean
    numbers: boolean
    symbols: boolean
    commonPassword: boolean
  }
  estimatedCrackTime: string
  recommendations: string[]
}

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null)

  const analyzePassword = () => {
    if (!password) return

    const criteria = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      commonPassword: !isCommonPassword(password),
    }

    const score = calculateScore(password, criteria)
    const strength = getStrengthLevel(score)
    const crackTime = estimateCrackTime(password, score)

    const recommendations = []
    if (!criteria.length) recommendations.push("Use at least 12 characters")
    if (!criteria.uppercase) recommendations.push("Include uppercase letters")
    if (!criteria.lowercase) recommendations.push("Include lowercase letters")
    if (!criteria.numbers) recommendations.push("Include numbers")
    if (!criteria.symbols) recommendations.push("Include special characters")
    if (!criteria.commonPassword) recommendations.push("Avoid common passwords")
    if (recommendations.length === 0) recommendations.push("Excellent password strength!")

    setAnalysis({
      password,
      strength,
      score,
      criteria,
      estimatedCrackTime: crackTime,
      recommendations,
    })
  }

  const calculateScore = (pwd: string, criteria: any) => {
    let score = 0

    // Length scoring
    if (pwd.length >= 8) score += 10
    if (pwd.length >= 12) score += 15
    if (pwd.length >= 16) score += 10

    // Character variety
    if (criteria.uppercase) score += 10
    if (criteria.lowercase) score += 10
    if (criteria.numbers) score += 10
    if (criteria.symbols) score += 15

    // Complexity patterns
    if (pwd.length > 8 && /(.)\1{2,}/.test(pwd)) score -= 10 // Repeated characters
    if (criteria.commonPassword) score += 20
    else score -= 20

    // Entropy bonus
    const uniqueChars = new Set(pwd).size
    score += Math.min(uniqueChars * 2, 20)

    return Math.max(0, Math.min(100, score))
  }

  const getStrengthLevel = (score: number) => {
    if (score >= 90) return "Very Strong"
    if (score >= 75) return "Strong"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    if (score >= 20) return "Weak"
    return "Very Weak"
  }

  const estimateCrackTime = (pwd: string, score: number) => {
    const length = pwd.length
    const hasUpper = /[A-Z]/.test(pwd)
    const hasLower = /[a-z]/.test(pwd)
    const hasNumbers = /\d/.test(pwd)
    const hasSymbols = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)

    let charset = 0
    if (hasLower) charset += 26
    if (hasUpper) charset += 26
    if (hasNumbers) charset += 10
    if (hasSymbols) charset += 32

    const combinations = Math.pow(charset, length)
    const guessesPerSecond = 1000000000 // 1 billion guesses per second
    const secondsToCrack = combinations / (2 * guessesPerSecond)

    if (secondsToCrack < 1) return "Instantly"
    if (secondsToCrack < 60) return `${Math.round(secondsToCrack)} seconds`
    if (secondsToCrack < 3600) return `${Math.round(secondsToCrack / 60)} minutes`
    if (secondsToCrack < 86400) return `${Math.round(secondsToCrack / 3600)} hours`
    if (secondsToCrack < 31536000) return `${Math.round(secondsToCrack / 86400)} days`
    if (secondsToCrack < 31536000000) return `${Math.round(secondsToCrack / 31536000)} years`
    return "Centuries"
  }

  const isCommonPassword = (pwd: string) => {
    const commonPasswords = [
      "password",
      "123456",
      "password123",
      "admin",
      "qwerty",
      "letmein",
      "welcome",
      "monkey",
      "1234567890",
      "abc123",
      "Password1",
      "password1",
    ]
    return commonPasswords.includes(pwd.toLowerCase())
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "Very Strong":
        return "text-green-500"
      case "Strong":
        return "text-green-400"
      case "Good":
        return "text-yellow-500"
      case "Fair":
        return "text-orange-500"
      case "Weak":
        return "text-red-400"
      default:
        return "text-red-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="password">Password to Analyze</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password to check strength"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (e.target.value) {
                  analyzePassword()
                } else {
                  setAnalysis(null)
                }
              }}
              className="cyber-input pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {analysis && (
        <div className="space-y-4">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                Password Strength Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Strength:</span>
                  <Badge className={getStrengthColor(analysis.strength)}>{analysis.strength}</Badge>
                </div>
                <Progress value={analysis.score} className="h-2" />
                <div className="text-xs text-muted-foreground text-right">{analysis.score}/100</div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Security Criteria</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(analysis.criteria).map(([key, met]) => (
                    <div key={key} className="flex items-center gap-2">
                      {met ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1").toLowerCase()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estimated Crack Time:</span>
                <span className="font-medium">{analysis.estimatedCrackTime}</span>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  {analysis.recommendations.map((rec, index) => (
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
