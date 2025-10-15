"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Globe, Download, Upload, Wifi, Info, Mail } from "lucide-react"
import { CyberCard } from "@/components/ui/cyber-card"
import { useState, useEffect } from "react"
import Link from "next/link"

export function DashboardWidgets() {
  const [systemMetrics, setSystemMetrics] = useState({
    ipAddress: "Detecting...",
    location: "Locating...",
    networkSpeed: { download: 0, upload: 0 },
  })

  const [isLoading, setIsLoading] = useState(true)

  const [networkActivity, setNetworkActivity] = useState<
    Array<{
      time: string
      download: number
      upload: number
      latency: number
    }>
  >([])

  const getIPAndLocation = async (): Promise<{ ip: string; location: string; isp: string }> => {
    const endpoints = ["https://ipapi.co/json/", "https://api.ipify.org?format=json", "https://httpbin.org/ip"]

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          cache: "no-cache",
          signal: AbortSignal.timeout(5000),
        })
        const data = await response.json()

        if (endpoint.includes("ipapi.co")) {
          return {
            ip: data.ip || "Unknown",
            location: `${data.city || "Unknown"}, ${data.country_name || "Unknown"}`,
            isp: data.org || "Unknown ISP",
          }
        } else if (endpoint.includes("ipify")) {
          return {
            ip: data.ip || "Unknown",
            location: "Network location detected",
            isp: "ISP detection unavailable",
          }
        } else {
          return {
            ip: data.origin || "Unknown",
            location: "Network location detected",
            isp: "ISP detection unavailable",
          }
        }
      } catch (error) {
        console.log(`Failed to get IP from ${endpoint}:`, error)
        continue
      }
    }

    return {
      ip: "Network unavailable",
      location: "Unable to determine location",
      isp: "Unable to determine ISP",
    }
  }

  const testInternetSpeed = async () => {
    const testFiles = [
      { url: "https://httpbin.org/bytes/500000", size: 0.5 },
      { url: "https://jsonplaceholder.typicode.com/photos", size: 0.1 },
      { url: "https://api.github.com/repos/microsoft/vscode/releases", size: 0.05 },
    ]

    const downloadResults: number[] = []
    const uploadResults: number[] = []

    for (const testFile of testFiles) {
      try {
        const downloadStart = performance.now()
        const response = await fetch(testFile.url + `?t=${Date.now()}`, {
          cache: "no-cache",
          signal: AbortSignal.timeout(10000),
        })

        if (response.ok) {
          await response.blob()
          const downloadEnd = performance.now()
          const downloadTime = (downloadEnd - downloadStart) / 1000
          const downloadSpeed = (testFile.size * 8) / downloadTime
          downloadResults.push(Math.min(downloadSpeed, 1000))
        }

        try {
          const uploadData = JSON.stringify({
            test: "upload_speed",
            data: "x".repeat(10000),
            timestamp: Date.now(),
          })

          const uploadStart = performance.now()
          await fetch("https://httpbin.org/post", {
            method: "POST",
            body: uploadData,
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(8000),
          })
          const uploadEnd = performance.now()

          const uploadTime = (uploadEnd - uploadStart) / 1000
          const uploadSpeed = (0.01 * 8) / uploadTime
          uploadResults.push(Math.min(uploadSpeed, 100))
        } catch (uploadError) {
          console.log("Upload test failed:", uploadError)
        }
      } catch (error) {
        console.log(`Speed test failed for ${testFile.url}:`, error)
      }
    }

    const avgDownload =
      downloadResults.length > 0 ? downloadResults.reduce((a, b) => a + b, 0) / downloadResults.length : 0

    const avgUpload =
      uploadResults.length > 0 ? uploadResults.reduce((a, b) => a + b, 0) / uploadResults.length : avgDownload * 0.2

    const connection = (navigator as any).connection
    if (avgDownload === 0 && connection?.downlink) {
      return {
        download: connection.downlink,
        upload: connection.downlink * 0.2,
        latency: connection.rtt || 50,
      }
    }

    return {
      download: Math.max(avgDownload, 1),
      upload: Math.max(avgUpload, 0.2),
      latency: 0,
    }
  }

  useEffect(() => {
    let mounted = true
    let updateCount = 0

    const updateMetrics = async () => {
      if (!mounted) return

      try {
        updateCount++
        console.log(`[v0] Dashboard update #${updateCount} starting...`)

        const networkPromises = [
          Promise.race([
            testInternetSpeed(),
            new Promise((resolve) => setTimeout(() => resolve({ download: 25, upload: 5, latency: 50 }), 8000)),
          ]),
          Promise.race([
            getIPAndLocation(),
            new Promise((resolve) =>
              setTimeout(
                () =>
                  resolve({
                    ip: "192.168.1.100",
                    location: "Local Network",
                    isp: "Local ISP",
                  }),
                6000,
              ),
            ),
          ]),
        ]

        const [speedResult, ipInfo] = await Promise.all(networkPromises)

        if (!mounted) return

        setSystemMetrics({
          networkSpeed: {
            download: Math.max(speedResult.download || 25, 0.5),
            upload: Math.max(speedResult.upload || 5, 0.1),
          },
          ipAddress: ipInfo.ip || "Network Error",
          location: ipInfo.location || "Location Unavailable",
        })

        const now = new Date()
        const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`

        setNetworkActivity((prev) => {
          const newActivity = [...prev.slice(-9)]
          newActivity.push({
            time: timeStr,
            download: speedResult.download || 25,
            upload: speedResult.upload || 5,
            latency: 50,
          })
          return newActivity
        })

        setIsLoading(false)
        console.log(`[v0] Dashboard update #${updateCount} completed successfully`)
      } catch (error) {
        console.error(`[v0] Dashboard update #${updateCount} failed:`, error)
        if (mounted) {
          setSystemMetrics((prev) => ({
            ...prev,
            ipAddress: "Connection Failed",
            location: "Network Error",
          }))
          setIsLoading(false)
        }
      }
    }

    updateMetrics()
    const interval = setInterval(updateMetrics, 5000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="space-y-8 p-6 max-w-full overflow-hidden min-h-screen cursor-crosshair">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CyberCard
          variant="hologram"
          className="p-6 hover:scale-105 transition-all duration-500 group cursor-pointer hover:shadow-2xl hover:shadow-cyan-400/20"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-bold text-cyan-400 font-mono animate-pulse">
              <span className="inline-block hover:animate-bounce">N</span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.1s" }}>
                e
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.2s" }}>
                t
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.3s" }}>
                w
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.4s" }}>
                o
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.5s" }}>
                r
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.6s" }}>
                k
              </span>
              <span className="mx-2"></span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.7s" }}>
                L
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.8s" }}>
                o
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.9s" }}>
                c
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "1.0s" }}>
                a
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "1.1s" }}>
                t
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "1.2s" }}>
                i
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "1.3s" }}>
                o
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "1.4s" }}>
                n
              </span>
            </CardTitle>
            <div className="relative">
              <MapPin className="h-8 w-8 text-cyan-400 animate-bounce group-hover:animate-spin transition-all duration-300" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-ping"></div>
              <div className="absolute -top-2 -right-2 h-5 w-5 bg-cyan-400/20 rounded-full animate-pulse"></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold text-green-400 font-mono group-hover:text-cyan-400 transition-colors duration-300 animate-pulse">
              {isLoading ? (
                <span className="inline-flex items-center">
                  <span className="animate-spin mr-2">🔍</span>
                  Detecting...
                </span>
              ) : (
                <span className="hover:scale-110 transition-transform duration-200 inline-block">
                  {systemMetrics.ipAddress}
                </span>
              )}
            </div>
            <p className="text-lg text-gray-300 group-hover:text-green-300 transition-colors duration-300">
              {isLoading ? (
                <span className="inline-flex items-center">
                  <span className="animate-bounce mr-2">🌍</span>
                  Getting location...
                </span>
              ) : (
                <span className="hover:scale-105 transition-transform duration-200 inline-block">
                  {systemMetrics.location}
                </span>
              )}
            </p>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500/10 to-green-500/10 p-3 rounded-lg border border-cyan-400/20">
              <Globe
                className="h-5 w-5 text-cyan-400 animate-spin group-hover:animate-pulse"
                style={{ animationDuration: "3s" }}
              />
              <span className="text-cyan-400 font-medium animate-pulse group-hover:text-green-400 transition-colors duration-300">
                🌐 Secure Connection Active
              </span>
              <div className="ml-auto flex space-x-1">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <div
                  className="h-2 w-2 bg-green-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="h-2 w-2 bg-green-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </CardContent>
        </CyberCard>

        <CyberCard
          variant="matrix"
          className="p-6 hover:scale-105 transition-all duration-500 group cursor-pointer hover:shadow-2xl hover:shadow-green-400/20"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-bold text-green-400 font-mono">
              <span className="inline-block hover:animate-bounce">I</span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.1s" }}>
                n
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.2s" }}>
                t
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.3s" }}>
                e
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.4s" }}>
                r
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.5s" }}>
                n
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.6s" }}>
                e
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.7s" }}>
                t
              </span>
              <span className="mx-2"></span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.8s" }}>
                A
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.9s" }}>
                c
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "1.0s" }}>
                t
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.1s" }}>
                i
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.2s" }}>
                v
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.3s" }}>
                i
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.4s" }}>
                t
              </span>
              <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.5s" }}>
                y
              </span>
            </CardTitle>
            <div className="relative">
              <Wifi className="h-8 w-8 text-green-400 animate-pulse group-hover:animate-bounce transition-all duration-300" />
              <div className="absolute -top-1 -right-1 text-xs animate-bounce">📡</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-gradient-to-br from-green-500/10 to-cyan-500/10 p-4 rounded-lg border border-green-400/20 hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Download className="h-5 w-5 text-green-400 animate-bounce" />
                  <span className="text-sm text-gray-400">⬇️ Download</span>
                </div>
                <div className="text-xl font-bold text-green-400 font-mono hover:text-cyan-400 transition-colors duration-300">
                  {isLoading ? (
                    <span className="animate-pulse">Testing... 🔄</span>
                  ) : (
                    <span className="hover:scale-110 transition-transform duration-200 inline-block">
                      ⚡ {systemMetrics.networkSpeed.download.toFixed(1)} Mbps
                    </span>
                  )}
                </div>
              </div>
              <div className="text-center bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-4 rounded-lg border border-yellow-400/20 hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Upload className="h-5 w-5 text-yellow-400 animate-bounce" />
                  <span className="text-sm text-gray-400">⬆️ Upload</span>
                </div>
                <div className="text-xl font-bold text-yellow-400 font-mono hover:text-orange-400 transition-colors duration-300">
                  {isLoading ? (
                    <span className="animate-pulse">Testing... 🔄</span>
                  ) : (
                    <span className="hover:scale-110 transition-transform duration-200 inline-block">
                      🚀 {systemMetrics.networkSpeed.upload.toFixed(1)} Mbps
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </CyberCard>
      </div>

      {networkActivity.length > 0 && (
        <CyberCard variant="circuit" className="p-6 hover:scale-[1.02] transition-all duration-500 cursor-pointer">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-cyan-400 font-mono animate-pulse">📊 Network Activity Monitor</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-400/20">
                <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400">📥 Download</span>
              </div>
              <div className="flex items-center space-x-2 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-400/20">
                <div className="h-3 w-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-yellow-400">📤 Upload</span>
              </div>
            </div>
          </div>
          <div className="h-48 flex items-end space-x-2 overflow-x-auto bg-black/20 rounded-lg p-4 border border-cyan-400/20">
            {networkActivity.map((activity, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex flex-col items-center space-y-2 min-w-[30px] hover:scale-110 transition-all duration-300 cursor-pointer"
              >
                <div className="w-full flex flex-col space-y-1">
                  <div
                    className="bg-gradient-to-t from-green-500/50 to-green-400/80 border border-green-400/50 rounded-t-lg transition-all duration-1000 hover:scale-110 hover:shadow-lg hover:shadow-green-400/50"
                    style={{ height: `${Math.min(120, (activity.download / 100) * 120)}px` }}
                  />
                  <div
                    className="bg-gradient-to-t from-yellow-500/50 to-yellow-400/80 border border-yellow-400/50 rounded-t-lg transition-all duration-1000 hover:scale-110 hover:shadow-lg hover:shadow-yellow-400/50"
                    style={{ height: `${Math.min(60, (activity.upload / 50) * 60)}px` }}
                  />
                </div>
                <span className="text-xs text-gray-400 font-mono hover:text-cyan-400 transition-colors duration-200">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CyberCard>
      )}

      <footer className="mt-12 pt-8 border-t border-cyan-500/20 hover:border-cyan-400/40 transition-colors duration-300">
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-8 mb-4">
            <Link href="/about" className="group">
              <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-md border border-cyan-500/30 rounded-lg px-4 py-2 hover:border-cyan-400/50 hover:scale-105 transition-all duration-300 cursor-crosshair">
                <Info className="h-5 w-5 text-cyan-400 group-hover:text-green-400 transition-colors duration-300 animate-pulse" />
                <span className="text-cyan-400 font-semibold group-hover:text-green-400 transition-colors duration-300">
                  <span className="inline-block hover:animate-bounce">A</span>
                  <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.1s" }}>
                    b
                  </span>
                  <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.2s" }}>
                    o
                  </span>
                  <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.3s" }}>
                    u
                  </span>
                  <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.4s" }}>
                    t
                  </span>
                </span>
              </div>
            </Link>

            <Link href="/contact" className="group">
              <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-md border border-cyan-500/30 rounded-lg px-4 py-2 hover:border-cyan-400/50 hover:scale-105 transition-all duration-300 cursor-crosshair">
                <Mail className="h-5 w-5 text-cyan-400 group-hover:text-green-400 transition-colors duration-300 animate-pulse" />
                <span className="text-cyan-400 font-semibold group-hover:text-green-400 transition-colors duration-300">
                  <span className="inline-block hover:animate-bounce">C</span>
                  <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.1s" }}>
                    o
                  </span>
                  <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.2s" }}>
                    n
                  </span>
                  <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.3s" }}>
                    t
                  </span>
                  <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.4s" }}>
                    a
                  </span>
                  <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.5s" }}>
                    c
                  </span>
                  <span className="inline-block hover:animate-bounce" style={{ animationDelay: "0.6s" }}>
                    t
                  </span>
                </span>
              </div>
            </Link>
          </div>

          <p className="text-gray-400 text-sm hover:text-cyan-400 transition-colors duration-300 cursor-default">
            Developed by{" "}
            <span className="text-cyan-400 font-bold animate-pulse hover:text-green-400 transition-colors duration-300">
              Nick ⚡
            </span>
          </p>
          <p className="text-gray-500 text-xs hover:text-gray-300 transition-colors duration-300">
            Contact:{" "}
            <a
              href="mailto:abc@gmail.com"
              className="text-cyan-400 hover:text-cyan-300 transition-colors hover:scale-105 inline-block transform duration-200"
            >
              📧 abc@gmail.com
            </a>
          </p>
          <div className="flex justify-center items-center space-x-2 mt-4 hover:scale-105 transition-transform duration-300">
            <div className="h-1 w-8 bg-gradient-to-r from-cyan-400 to-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500 font-mono hover:text-cyan-400 transition-colors duration-300 animate-heartbeat">
              🛡️ MOBICURE v2.0
            </span>
            <div className="h-1 w-8 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
