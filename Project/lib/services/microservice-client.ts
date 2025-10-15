"use client"

export class MicroserviceClient {
  private baseUrl: string

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl
  }

  async scanUrl(url: string) {
    const response = await fetch(`${this.baseUrl}/scan-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      throw new Error("Failed to scan URL")
    }

    return response.json()
  }

  async scanNetwork(networkRange?: string) {
    const response = await fetch(`${this.baseUrl}/scan-network`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ networkRange }),
    })

    if (!response.ok) {
      throw new Error("Failed to scan network")
    }

    return response.json()
  }

  async checkBreach(email: string) {
    const response = await fetch(`${this.baseUrl}/check-breach`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      throw new Error("Failed to check breach")
    }

    return response.json()
  }

  async analyzeImage(imageFile: File) {
    const formData = new FormData()
    formData.append("image", imageFile)

    const response = await fetch(`${this.baseUrl}/analyze-image`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to analyze image")
    }

    return response.json()
  }

  async analyzeApk(apkFile: File) {
    const formData = new FormData()
    formData.append("apk", apkFile)

    const response = await fetch(`${this.baseUrl}/analyze-apk`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to analyze APK")
    }

    return response.json()
  }
}

export const microserviceClient = new MicroserviceClient()
