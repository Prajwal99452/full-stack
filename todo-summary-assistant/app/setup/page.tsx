"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { initializeDatabase } from "../actions"
import { useRouter } from "next/navigation"

export default function SetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Auto-initialize on page load
    handleInitialize()
  }, [])

  async function handleInitialize() {
    setStatus("loading")
    setMessage("Initializing database...")

    try {
      const result = await initializeDatabase()

      if (result.success) {
        setStatus("success")
        setMessage(result.message || "Database initialized successfully!")
      } else {
        setStatus("error")
        setMessage(result.error || "Failed to initialize database")
      }
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "An unknown error occurred")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Todo App Setup</CardTitle>
          <CardDescription>Initialize the database for the Todo Summary Assistant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-muted">
              <p className="font-medium mb-2">
                Status: {status === "idle" ? "Ready" : status.charAt(0).toUpperCase() + status.slice(1)}
              </p>
              {message && <p className="text-sm">{message}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleInitialize} disabled={status === "loading"}>
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              "Initialize Database"
            )}
          </Button>

          <Button variant="outline" onClick={() => router.push("/")} disabled={status === "loading"}>
            Go to App
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
