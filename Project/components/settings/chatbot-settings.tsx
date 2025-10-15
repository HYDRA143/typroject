"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bot, Volume2, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const botAvatars = [
  { id: "cyber", name: "Cyber Guardian", emoji: "🤖", description: "Classic cybersecurity assistant" },
  { id: "shield", name: "Security Shield", emoji: "🛡️", description: "Protective security expert" },
  { id: "hacker", name: "Ethical Hacker", emoji: "👨‍💻", description: "White-hat security specialist" },
]

export function ChatbotSettings() {
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [voiceTone, setVoiceTone] = useState("professional")
  const [selectedAvatar, setSelectedAvatar] = useState("cyber")
  const { toast } = useToast()

  useEffect(() => {
    const voice = localStorage.getItem("mobicure_voice_enabled")
    const tone = localStorage.getItem("mobicure_voice_tone")
    const avatar = localStorage.getItem("mobicure_bot_avatar")

    if (voice !== null) setVoiceEnabled(voice === "true")
    if (tone) setVoiceTone(tone)
    if (avatar) setSelectedAvatar(avatar)
  }, [])

  const handleVoiceToggle = (enabled: boolean) => {
    setVoiceEnabled(enabled)
    localStorage.setItem("mobicure_voice_enabled", enabled.toString())

    if (!enabled) {
      // Stop any ongoing speech
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }

    toast({
      title: enabled ? "Voice Enabled" : "Voice Disabled",
      description: enabled ? "MOBICURE AI will now speak responses" : "Voice responses have been disabled",
    })
  }

  const handleVoiceToneChange = (tone: string) => {
    setVoiceTone(tone)
    localStorage.setItem("mobicure_voice_tone", tone)
    toast({
      title: "Voice Tone Updated",
      description: `Voice tone set to ${tone}`,
    })
  }

  const handleAvatarChange = (avatarId: string) => {
    setSelectedAvatar(avatarId)
    localStorage.setItem("mobicure_bot_avatar", avatarId)
    toast({
      title: "Avatar Updated",
      description: `Bot avatar changed to ${botAvatars.find((a) => a.id === avatarId)?.name}`,
    })
  }

  const testVoice = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      toast({
        title: "Voice Not Available",
        description: "Speech synthesis is not supported in this browser",
        variant: "destructive",
      })
      return
    }

    if (!voiceEnabled) {
      toast({
        title: "Voice Not Enabled",
        description: "Please enable voice responses first",
        variant: "destructive",
      })
      return
    }

    const utterance = new SpeechSynthesisUtterance(
      "Hello! I'm your MOBICURE AI Assistant. This is how I sound with the current voice settings.",
    )

    const voices = window.speechSynthesis.getVoices()
    let selectedVoice = voices.find((voice) => voice.lang.startsWith("en"))

    if (voiceTone === "friendly" && voices.length > 1) {
      selectedVoice = voices.find((voice) => voice.name.includes("Female")) || selectedVoice
    } else if (voiceTone === "authoritative") {
      selectedVoice = voices.find((voice) => voice.name.includes("Male")) || selectedVoice
    }

    if (selectedVoice) utterance.voice = selectedVoice
    utterance.rate = 0.9
    utterance.pitch = voiceTone === "friendly" ? 1.1 : voiceTone === "authoritative" ? 0.9 : 1.0

    window.speechSynthesis.speak(utterance)

    toast({
      title: "Voice Test",
      description: "Playing voice sample with current settings",
    })
  }

  return (
    <Card className="bg-card/30 backdrop-blur-sm neon-border">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Bot className="h-6 w-6 text-primary glow-primary" />
          <CardTitle className="text-xl font-bold text-primary font-[var(--font-heading)]">
            AI Assistant Settings
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Voice Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Volume2 className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Voice Responses</p>
                <p className="text-xs text-muted-foreground">Enable text-to-speech for bot responses</p>
              </div>
            </div>
            <Switch checked={voiceEnabled} onCheckedChange={handleVoiceToggle} />
          </div>

          {voiceEnabled && (
            <div className="space-y-4 pl-8">
              <div className="space-y-2">
                <label className="text-sm font-medium">Voice Tone</label>
                <Select value={voiceTone} onValueChange={handleVoiceToneChange}>
                  <SelectTrigger className="bg-muted/20 border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={testVoice}
                variant="outline"
                className="w-full border-primary/30 hover:border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
              >
                Test Voice
              </Button>
            </div>
          )}
        </div>

        {/* Avatar Settings */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Bot Avatar</p>
              <p className="text-xs text-muted-foreground">Choose your assistant's appearance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {botAvatars.map((avatar) => (
              <div
                key={avatar.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                  selectedAvatar === avatar.id
                    ? "border-primary/50 bg-primary/10"
                    : "border-muted/30 hover:border-primary/30 hover:bg-muted/10"
                }`}
                onClick={() => handleAvatarChange(avatar.id)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{avatar.emoji}</span>
                  <div>
                    <p className="text-sm font-medium">{avatar.name}</p>
                    <p className="text-xs text-muted-foreground">{avatar.description}</p>
                  </div>
                  {selectedAvatar === avatar.id && <div className="ml-auto h-2 w-2 bg-primary rounded-full" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
