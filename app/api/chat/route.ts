import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        response:
          "Please add your GEMINI_API_KEY to the environment variables in Project Settings to enable AI responses.",
      })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `You are GuardianAI, an advanced cybersecurity assistant. You specialize in:
    - Threat analysis and detection
    - Security best practices and recommendations
    - Network security and monitoring
    - Password and authentication security
    - Privacy protection and data encryption
    - Incident response and recovery
    
    Respond to cybersecurity questions with expertise, provide actionable advice, and maintain a professional yet approachable tone. Keep responses concise but informative.
    
    User question: ${message}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        response:
          "I'm experiencing technical difficulties. Please check your API key configuration or try again later.",
      },
      { status: 500 },
    )
  }
}
