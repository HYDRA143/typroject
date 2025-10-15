import type React from "react"
import type { Metadata, Viewport } from "next"
import { Montserrat, Open_Sans } from "next/font/google"
import { Navbar } from "@/components/navbar"
import { Chatbot } from "@/components/chatbot/chatbot"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-montserrat",
  display: "swap",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-open-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "MOBICURE - Advanced Cybersecurity Command Center",
  description:
    "Professional cybersecurity monitoring, threat detection, and network security analysis platform developed by Nick",
  generator: "developed by nick",
  keywords: [
    "cybersecurity",
    "threat detection",
    "network security",
    "malware scanner",
    "vulnerability assessment",
  ],
  authors: [{ name: "Nick" }],
  creator: "Nick",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
}

// ✅ Fixed viewport config
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#00ffe7",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${openSans.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Header */}
        <Navbar />

        {/* Body */}
        <main className="pt-20">{children}</main>

        {/* Footer (Chatbot here for now) */}
        <footer>
          <Chatbot />
        </footer>
      </body>
    </html>
  )
}
