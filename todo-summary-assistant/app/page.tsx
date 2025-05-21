import TodoApp from "@/components/todo-app"
import Link from "next/link"
import { InfoIcon as InfoCircle } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Todo Summary Assistant</h1>
          <Link
            href="/setup-instructions"
            className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <InfoCircle className="h-4 w-4" />
            Setup Instructions
          </Link>
        </div>
        <TodoApp />
      </div>
    </main>
  )
}
