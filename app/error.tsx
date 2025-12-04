"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] Error occurred:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">حدث خطأ ما</h2>
        <p className="text-muted-foreground mb-8">نعتذر عن الإزعاج. حدث خطأ غير متوقع.</p>
        <Button
          onClick={reset}
          size="lg"
          className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          حاول مرة أخرى
        </Button>
      </div>
    </div>
  )
}
