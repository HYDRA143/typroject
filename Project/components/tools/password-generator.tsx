"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Key, Copy, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const generatePassword = () => {
    setIsGenerating(true)

    let charset = ""
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (charset === "") {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive",
      })
      setIsGenerating(false)
      return
    }

    let result = ""
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    setTimeout(() => {
      setPassword(result)
      setIsGenerating(false)
    }, 500)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    toast({
      title: "Copied!",
      description: "Password copied to clipboard",
    })
  }

  return (
    <Card className="bg-card/30 backdrop-blur-sm neon-border">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Key className="h-6 w-6 text-primary glow-primary" />
          <CardTitle className="text-xl font-bold text-primary font-[var(--font-heading)]">
            Password Generator
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="length" className="text-sm font-medium">
              Password Length: {length}
            </Label>
            <Input
              id="length"
              type="range"
              min="8"
              max="128"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
              <Label htmlFor="uppercase" className="text-sm">
                Uppercase (A-Z)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
              <Label htmlFor="lowercase" className="text-sm">
                Lowercase (a-z)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
              <Label htmlFor="numbers" className="text-sm">
                Numbers (0-9)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
              <Label htmlFor="symbols" className="text-sm">
                Symbols (!@#$)
              </Label>
            </div>
          </div>
        </div>

        <Button
          onClick={generatePassword}
          disabled={isGenerating}
          className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 hover:border-primary/50"
        >
          {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Key className="h-4 w-4 mr-2" />}
          Generate Password
        </Button>

        {password && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Generated Password:</Label>
            <div className="flex items-center space-x-2">
              <Input value={password} readOnly className="font-mono text-sm bg-muted/50" />
              <Button
                onClick={copyToClipboard}
                size="sm"
                variant="outline"
                className="border-primary/30 hover:border-primary/50 bg-transparent"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
