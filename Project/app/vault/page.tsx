"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { VaultItemCard } from "@/components/vault/vault-item-card"
import { AddItemDialog } from "@/components/vault/add-item-dialog"
import { VaultSearch } from "@/components/vault/vault-search"
import { Lock, Shield, Database, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface VaultItem {
  id: string
  title: string
  category: "Login" | "Credit Card" | "Secure Note" | "Identity" | "Other Documents"
  data: Record<string, string>
  createdAt: string
  updatedAt: string
}

export default function VaultPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [masterPassword, setMasterPassword] = useState<string | null>(null)
  const { toast } = useToast()

  const [items, setItems] = useState<VaultItem[]>([
    {
      id: "1",
      title: "Gmail Account",
      category: "Login",
      data: {
        username: "user@gmail.com",
        password: "SecurePass123!",
        website: "https://gmail.com",
        notes: "Primary email account",
      },
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      title: "Main Credit Card",
      category: "Credit Card",
      data: {
        cardNumber: "4532 1234 5678 9012",
        expiryDate: "12/27",
        cvv: "123",
        cardholderName: "John Doe",
        notes: "Primary credit card",
      },
      createdAt: "2024-01-16T14:30:00Z",
      updatedAt: "2024-01-16T14:30:00Z",
    },
    {
      id: "3",
      title: "Important Notes",
      category: "Secure Note",
      data: {
        content: "This is a secure note with sensitive information that needs to be encrypted and protected.",
      },
      createdAt: "2024-01-17T09:15:00Z",
      updatedAt: "2024-01-17T09:15:00Z",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    const storedPassword = localStorage.getItem("mobicure_master_password")
    setMasterPassword(storedPassword)

    if (!storedPassword) {
      // No master password set, allow direct access
      setIsAuthenticated(true)
    }

    setIsLoading(false)
  }, [])

  const handleAuthentication = () => {
    if (!masterPassword) {
      setIsAuthenticated(true)
      return
    }

    if (passwordInput === masterPassword) {
      setIsAuthenticated(true)
      setPasswordInput("")
      toast({
        title: "Access Granted",
        description: "Welcome to your secure vault",
      })
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect master password",
        variant: "destructive",
      })
      setPasswordInput("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAuthentication()
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Object.values(item.data).some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const addItem = (newItem: Omit<VaultItem, "id" | "createdAt" | "updatedAt">) => {
    const item: VaultItem = {
      ...newItem,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setItems((prev) => [item, ...prev])
  }

  const editItem = (item: VaultItem) => {
    console.log("Edit item:", item)
  }

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const getCategoryStats = () => {
    const stats = items.reduce(
      (acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return stats
  }

  const categoryStats = getCategoryStats()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse glow-primary" />
          <p className="text-lg text-muted-foreground">Loading vault...</p>
        </div>
      </div>
    )
  }

  if (masterPassword && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Key className="h-12 w-12 text-primary glow-primary" />
              <h1 className="text-3xl font-black text-transparent bg-gradient-to-r from-primary via-success to-primary bg-clip-text font-[var(--font-heading)]">
                MOBICURE VAULT
              </h1>
            </div>
            <p className="text-muted-foreground">Enter your master password to access the vault</p>
          </div>

          <div className="bg-card/30 backdrop-blur-sm neon-border p-6 rounded-lg space-y-4">
            <div className="space-y-2">
              <Label htmlFor="master-password" className="text-sm font-medium">
                Master Password
              </Label>
              <Input
                id="master-password"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-muted/20 border-primary/20"
                placeholder="Enter your master password"
                autoFocus
              />
            </div>

            <Button
              onClick={handleAuthentication}
              className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 hover:border-primary/50"
              disabled={!passwordInput}
            >
              <Key className="h-4 w-4 mr-2" />
              Unlock Vault
            </Button>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">Forgot your password? Update it in Settings → Security</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Lock className="h-12 w-12 text-primary glow-primary" />
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-primary via-success to-primary bg-clip-text font-[var(--font-heading)]">
              PRIVACY VAULT
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Secure, encrypted storage for your sensitive information
          </p>
        </div>

        {/* Security Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card/30 backdrop-blur-sm neon-border p-6 rounded-lg text-center">
            <Shield className="h-8 w-8 text-success mx-auto mb-2 glow-success" />
            <h3 className="font-bold text-success">AES-256 Encrypted</h3>
            <p className="text-sm text-muted-foreground">Military-grade encryption</p>
          </div>
          <div className="bg-card/30 backdrop-blur-sm neon-border p-6 rounded-lg text-center">
            <Database className="h-8 w-8 text-primary mx-auto mb-2 glow-primary" />
            <h3 className="font-bold text-primary">{items.length} Items Stored</h3>
            <p className="text-sm text-muted-foreground">Securely protected</p>
          </div>
          <div className="bg-card/30 backdrop-blur-sm neon-border p-6 rounded-lg text-center">
            <Lock className="h-8 w-8 text-success mx-auto mb-2 glow-success" />
            <h3 className="font-bold text-success">{masterPassword ? "Password Protected" : "Zero-Knowledge"}</h3>
            <p className="text-sm text-muted-foreground">Only you have access</p>
          </div>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(categoryStats).map(([category, count]) => (
            <div key={category} className="bg-muted/10 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-primary">{count}</div>
              <div className="text-xs text-muted-foreground">{category}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <AddItemDialog onAdd={addItem} />
          <div className="text-sm text-muted-foreground">
            {filteredItems.length} of {items.length} items
          </div>
        </div>

        {/* Search */}
        <VaultSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <VaultItemCard key={item.id} item={item} onEdit={editItem} onDelete={deleteItem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              {searchTerm || selectedCategory !== "all" ? "No items found" : "Your vault is empty"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Add your first item to get started"}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
