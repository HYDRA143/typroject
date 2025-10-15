"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Send, Minimize2, Sparkles, Volume2, VolumeX } from "lucide-react"
import { CyberCard } from "@/components/ui/cyber-card"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm GuardianAI Assistant. I can help you with cybersecurity questions, analyze threats, and guide you through security tools. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const speakMessage = (text: string) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    // Get voice settings from localStorage
    const voiceTone = localStorage.getItem("guardianai_voice_tone") || "professional"
    const voices = window.speechSynthesis.getVoices()

    // Select voice based on tone preference
    let selectedVoice = voices.find((voice) => voice.lang.startsWith("en"))
    if (voiceTone === "friendly" && voices.length > 1) {
      selectedVoice = voices.find((voice) => voice.name.includes("Female")) || selectedVoice
    } else if (voiceTone === "authoritative") {
      selectedVoice = voices.find((voice) => voice.name.includes("Male")) || selectedVoice
    }

    if (selectedVoice) utterance.voice = selectedVoice
    utterance.rate = 0.9
    utterance.pitch = voiceTone === "friendly" ? 1.1 : voiceTone === "authoritative" ? 0.9 : 1.0

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const voiceSetting = localStorage.getItem("guardianai_voice_enabled")
    setVoiceEnabled(voiceSetting === "true")
  }, [])

  const getBotResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      })
      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("Chat error:", error)
      return "I'm experiencing technical difficulties. Please check your connection and try again."
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentMessage = inputMessage
    setInputMessage("")
    setIsTyping(true)

    try {
      const botResponseText = await getBotResponse(currentMessage)

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponseText,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)

      if (voiceEnabled) {
        speakMessage(botResponseText)
      }
    } catch (error) {
      setIsTyping(false)
      console.error("Error getting bot response:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleVoice = () => {
    const newVoiceState = !voiceEnabled
    setVoiceEnabled(newVoiceState)
    localStorage.setItem("guardianai_voice_enabled", newVoiceState.toString())

    if (!newVoiceState) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="relative bg-gradient-to-r from-cyan-500/20 via-cyan-400/15 to-green-500/20 hover:from-cyan-500/30 hover:via-cyan-400/25 hover:to-green-500/30 text-cyan-400 border-2 border-cyan-500/50 rounded-full p-4 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 group backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-green-500/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
          <div className="relative flex items-center space-x-2">
            <Bot className="h-6 w-6 text-cyan-400" />
            <Sparkles className="h-4 w-4 animate-pulse text-green-400" />
          </div>
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 h-[400px] sm:h-[500px]">
      <CyberCard variant="hologram" className="h-full flex flex-col shadow-2xl shadow-cyan-500/20 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-cyan-500/10 to-green-500/10 rounded-t-lg border-b border-cyan-500/20">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Bot className="h-5 w-5 text-cyan-400" />
              <div className="absolute inset-0 animate-pulse">
                <Bot className="h-5 w-5 text-cyan-400/30" />
              </div>
            </div>
            <CardTitle className="text-base sm:text-lg font-bold text-cyan-400 font-mono">MOBICURE Assistant</CardTitle>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-medium hidden sm:inline">ONLINE</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVoice}
              className={`text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 ${voiceEnabled ? "text-cyan-400" : ""}`}
            >
              {voiceEnabled ? (
                isSpeaking ? (
                  <Volume2 className="h-4 w-4 animate-pulse" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4 p-3 sm:p-4 bg-gray-900/50">
          <ScrollArea className="flex-1 pr-2 sm:pr-4">
            <div className="space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] p-2 sm:p-3 rounded-lg transition-all duration-300 ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-cyan-500/20 to-cyan-400/30 text-cyan-100 border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                        : "bg-gradient-to-r from-gray-800/60 to-gray-700/60 text-gray-100 border border-gray-600/30 shadow-lg backdrop-blur-sm"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === "bot" && (
                        <div className="relative">
                          <Bot className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <div className="absolute inset-0 animate-pulse">
                            <Bot className="h-4 w-4 text-cyan-400/30 mt-0.5 flex-shrink-0" />
                          </div>
                        </div>
                      )}
                      {message.sender === "user" && <User className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />}
                      <div className="text-sm leading-relaxed">{message.content}</div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 text-gray-100 border border-gray-600/30 p-2 sm:p-3 rounded-lg shadow-lg backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-cyan-400" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">AI analyzing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about cybersecurity..."
              className="flex-1 bg-gray-800/50 border-cyan-500/20 focus:border-cyan-500/50 transition-all duration-300 text-gray-100 placeholder-gray-400"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-cyan-500/20 to-green-500/20 hover:from-cyan-500/30 hover:to-green-500/30 text-cyan-400 border border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </CyberCard>
    </div>
  )
}
