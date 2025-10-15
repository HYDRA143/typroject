import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Mock breach data
    const mockBreaches: Record<string, any[]> = {
      "test@example.com": [
        {
          name: "DataCorp Breach 2023",
          date: "2023-08-15",
          data_types: ["Email addresses", "Passwords", "Names", "Phone numbers"],
          threat_level: "High",
          description: "Major data breach affecting 2.5 million users",
        },
        {
          name: "SocialNet Leak 2022",
          date: "2022-03-10",
          data_types: ["Email addresses", "Profile data", "Messages"],
          threat_level: "Medium",
          description: "Social media platform data exposure",
        },
      ],
      "admin@test.com": [
        {
          name: "TechCorp Incident 2024",
          date: "2024-01-20",
          data_types: ["Email addresses", "Encrypted passwords", "User preferences"],
          threat_level: "Low",
          description: "Limited exposure of user account data",
        },
      ],
    }

    const breaches = mockBreaches[email.toLowerCase()] || []
    const isCompromised = breaches.length > 0

    // Calculate risk assessment
    let riskScore = 0
    for (const breach of breaches) {
      switch (breach.threat_level) {
        case "Critical":
          riskScore += 40
          break
        case "High":
          riskScore += 30
          break
        case "Medium":
          riskScore += 20
          break
        default:
          riskScore += 10
      }
    }

    const riskLevel = riskScore >= 80 ? "Critical" : riskScore >= 60 ? "High" : riskScore >= 30 ? "Medium" : "Low"

    const result = {
      email,
      is_compromised: isCompromised,
      breach_count: breaches.length,
      breaches,
      risk_assessment: {
        level: riskLevel,
        score: Math.min(riskScore, 100),
        description: `Risk level: ${riskLevel} based on ${breaches.length} breach(es)`,
      },
      check_timestamp: new Date().toISOString(),
      recommendations: isCompromised
        ? [
            "Change passwords for all accounts associated with this email",
            "Enable two-factor authentication where possible",
            "Monitor your accounts for suspicious activity",
          ]
        : ["Your email appears to be safe from known breaches."],
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to check breaches" }, { status: 500 })
  }
}
