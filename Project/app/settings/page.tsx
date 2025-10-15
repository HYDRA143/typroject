import { SecuritySettings } from "@/components/settings/security-settings"
import { AppearanceSettings } from "@/components/settings/appearance-settings"
import { DataManagement } from "@/components/settings/data-management"
import { AboutSection } from "@/components/settings/about-section"
import { ChatbotSettings } from "@/components/settings/chatbot-settings"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Settings className="h-12 w-12 text-primary glow-primary" />
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-primary via-success to-primary bg-clip-text font-[var(--font-heading)]">
              SETTINGS
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Configure your security preferences and manage application data
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Security Settings */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6 font-[var(--font-heading)]">Security</h2>
            <SecuritySettings />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6 font-[var(--font-heading)]">AI Assistant</h2>
            <ChatbotSettings />
          </section>

          {/* Appearance Settings */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6 font-[var(--font-heading)]">Preferences</h2>
            <AppearanceSettings />
          </section>

          {/* Data Management */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6 font-[var(--font-heading)]">Data Management</h2>
            <DataManagement />
          </section>

          {/* About Section */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6 font-[var(--font-heading)]">About</h2>
            <AboutSection />
          </section>
        </div>
      </main>
    </div>
  )
}
