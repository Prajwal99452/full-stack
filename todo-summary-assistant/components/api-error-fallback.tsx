"use client"

import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ApiErrorFallbackProps {
  onRetry: () => void
  error?: string
}

export default function ApiErrorFallback({ onRetry, error }: ApiErrorFallbackProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Connection Issue
        </CardTitle>
        <CardDescription>We're having trouble connecting to the server</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {error ||
            "There was a problem connecting to the API. This could be due to network issues or server problems."}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={onRetry} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </CardFooter>
    </Card>
  )
}
