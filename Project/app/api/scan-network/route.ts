import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { networkRange } = await request.json()

    // Mock network scan results
    const mockDevices = [
      {
        ip: "192.168.1.1",
        hostname: "Router",
        device_type: "Gateway",
        status: "online",
        last_seen: "Now",
        is_secure: true,
        open_ports: [80, 443],
      },
      {
        ip: "192.168.1.100",
        hostname: "Desktop-PC",
        device_type: "Computer",
        status: "online",
        last_seen: "2 minutes ago",
        is_secure: true,
        open_ports: [135, 445],
      },
      {
        ip: "192.168.1.105",
        hostname: "iPhone-12",
        device_type: "Mobile",
        status: "online",
        last_seen: "5 minutes ago",
        is_secure: true,
        open_ports: [],
      },
      {
        ip: "192.168.1.150",
        hostname: "Unknown-Device",
        device_type: "Unknown",
        status: "online",
        last_seen: "1 minute ago",
        is_secure: false,
        open_ports: [22, 23, 80],
      },
    ]

    const result = {
      network_range: networkRange || "192.168.1.0/24",
      devices: mockDevices,
      statistics: {
        total_devices: mockDevices.length,
        secure_devices: mockDevices.filter((d) => d.is_secure).length,
        unknown_devices: mockDevices.filter((d) => d.device_type === "Unknown").length,
        scan_timestamp: new Date().toISOString(),
      },
      scan_duration: "2.3 seconds",
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2500))

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to scan network" }, { status: 500 })
  }
}
