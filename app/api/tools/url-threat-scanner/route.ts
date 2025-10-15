import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Validate URL format
    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    try {
      const pythonScript = path.join(process.cwd(), "scripts", "url_threat_scanner_service.py")

      const result = await new Promise((resolve, reject) => {
        const pythonProcess = spawn("python3", [pythonScript, url], {
          stdio: ["pipe", "pipe", "pipe"],
        })

        let output = ""
        let errorOutput = ""

        pythonProcess.stdout.on("data", (data) => {
          output += data.toString()
        })

        pythonProcess.stderr.on("data", (data) => {
          errorOutput += data.toString()
        })

        pythonProcess.on("close", (code) => {
          if (code === 0) {
            try {
              const scanResults = JSON.parse(output)
              resolve(scanResults)
            } catch (parseError) {
              reject(new Error(`Failed to parse Python output: ${parseError}`))
            }
          } else {
            reject(new Error(`Python script failed with code ${code}: ${errorOutput}`))
          }
        })

        // Timeout after 30 seconds
        setTimeout(() => {
          pythonProcess.kill()
          reject(new Error("Scan timeout"))
        }, 30000)
      })

      return NextResponse.json(result)
    } catch (pythonError) {
      console.error("Python service error:", pythonError)

      const threats: string[] = []
      const sources = ["SSL Analysis", "Domain Reputation", "Malware Database", "Phishing Detection"]
      let reputation = 100

      // Enhanced suspicious pattern detection
      const suspiciousPatterns = [
        { pattern: /bit\.ly|tinyurl|t\.co|goo\.gl/i, threat: "URL Shortener", penalty: 15 },
        { pattern: /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/i, threat: "IP Address", penalty: 25 },
        { pattern: /[a-z0-9]+-[a-z0-9]+-[a-z0-9]+\.(tk|ml|ga|cf)/i, threat: "Suspicious TLD", penalty: 30 },
        { pattern: /phishing|malware|virus|trojan|scam|fake/i, threat: "Malicious Keywords", penalty: 40 },
        { pattern: /secure.*login|verify.*account|suspended.*account/i, threat: "Phishing Pattern", penalty: 35 },
        { pattern: /[0-9]{10,}/i, threat: "Long Number Sequence", penalty: 20 },
        { pattern: /-{3,}/i, threat: "Multiple Dashes", penalty: 15 },
      ]

      suspiciousPatterns.forEach(({ pattern, threat, penalty }) => {
        if (pattern.test(url)) {
          threats.push(threat)
          reputation -= penalty
        }
      })

      // Protocol check
      if (parsedUrl.protocol === "http:") {
        threats.push("Insecure HTTP Protocol")
        reputation -= 20
      }

      // Domain age simulation (new domains are suspicious)
      const domain = parsedUrl.hostname
      if (domain.length > 30) {
        threats.push("Unusually Long Domain")
        reputation -= 15
      }

      // Check for suspicious subdomains
      const subdomains = domain.split(".")
      if (subdomains.length > 4) {
        threats.push("Multiple Subdomains")
        reputation -= 10
      }

      // Determine risk level
      let risk_level: string
      if (reputation >= 80) {
        risk_level = "Low Risk"
      } else if (reputation >= 60) {
        risk_level = "Medium Risk"
      } else if (reputation >= 40) {
        risk_level = "High Risk"
      } else {
        risk_level = "Critical Risk"
      }

      const fallbackResult = {
        url,
        timestamp: new Date().toISOString(),
        threat_score: Math.max(0, reputation),
        risk_level,
        ssl_analysis: { valid: parsedUrl.protocol === "https:" },
        domain_reputation: {
          score: reputation,
          flags: threats,
          category: reputation > 70 ? "Clean" : reputation > 40 ? "Suspicious" : "Malicious",
        },
        malware_check: {
          detected: threats.some((t) => t.includes("Malicious")),
          databases_checked: ["Internal Analysis"],
          confidence: threats.length > 0 ? 0.8 : 0.1,
        },
        phishing_analysis: {
          detected: threats.some((t) => t.includes("Phishing")),
          patterns: threats.filter((t) => t.includes("Phishing")),
        },
        redirect_chain: { chain: [{ url }], suspicious: false },
        content_analysis: { suspicious: threats.length > 2 },
        service_note: "Using fallback analysis - Python service unavailable",
      }

      return NextResponse.json(fallbackResult)
    }
  } catch (error) {
    console.error("URL scan error:", error)
    return NextResponse.json(
      {
        error: "Scan failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
