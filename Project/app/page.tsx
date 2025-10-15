import { DashboardWidgets } from "@/components/dashboard-widgets"
import { AnimatedBackground } from "@/components/ui/animated-background"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-black cyber-text mb-4 font-[var(--font-heading)]">
              CYBERSECURITY
            </h1>
            <h2
              className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-[var(--font-heading)] glitch-text"
              data-text="COMMAND CENTER"
            >
              COMMAND CENTER
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced threat detection and security monitoring platform powered by AI
            </p>
          </div>

          <DashboardWidgets />
        </main>
      </div>
    </div>
  )
}
