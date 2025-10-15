import * as React from "react"
import { useIsMobile } from "@/components/ui/use-mobile"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function ToolCard({ tool }) {
  const isMobile = useIsMobile()

  return (
    <div
      className={`bg-card rounded-lg shadow-md p-4 flex flex-col w-full mb-4`}
      style={{
        minWidth: "0",
        maxWidth: "100%",
        touchAction: "manipulation",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <tool.icon
          className={`h-8 w-8 ${tool.color} group-hover:scale-110 transition-transform duration-300`}
          aria-label={tool.title}
        />
        <span className="text-xs px-2 py-1 bg-muted/50 rounded-full text-muted-foreground">
          {tool.category}
        </span>
      </div>
      <h3 className="text-lg font-bold mb-1">{tool.title}</h3>
      <p className="text-sm break-words">{tool.description}</p>
      {/* Add more tool content here */}
    </div>
  )
}
