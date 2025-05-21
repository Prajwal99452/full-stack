"use client"

import { useState, useEffect } from "react"
import type { Todo } from "@/types/todo"
import TodoList from "./todo-list"
import TodoForm from "./todo-form"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { useToast } from "./ui/use-toast"
import { Input } from "./ui/input"
import { Loader2, Send, AlertTriangle } from "lucide-react"
import ApiErrorFallback from "./api-error-fallback"

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [summarizing, setSummarizing] = useState(false)
  const [slackWebhookUrl, setSlackWebhookUrl] = useState("")
  const { toast } = useToast()
  const [apiError, setApiError] = useState<string | null>(null)
  const [tableExists, setTableExists] = useState(true)

  useEffect(() => {
    fetchTodos()

    // Try to get saved webhook URL from localStorage
    const savedWebhookUrl = localStorage.getItem("slackWebhookUrl")
    if (savedWebhookUrl) {
      setSlackWebhookUrl(savedWebhookUrl)
    }
  }, [])

  const fetchTodos = async () => {
    setLoading(true)
    setApiError(null)
    try {
      const response = await fetch("/api/todos")

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Error response:", response.status, errorData)

        // Check if the error is about the table not existing
        if (
          errorData.error?.includes('relation "public.todos" does not exist') ||
          (errorData.error?.includes("relation") && errorData.error?.includes("does not exist"))
        ) {
          setTableExists(false)
          setLoading(false)
          return
        }

        throw new Error(errorData.error || `Server responded with ${response.status}`)
      }

      const data = await response.json()
      setTodos(Array.isArray(data) ? data : [])
      setTableExists(true)
    } catch (error) {
      console.error("Error fetching todos:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to load todos. Please try again."

      // Check if the error is about the table not existing
      if (
        errorMessage.includes('relation "public.todos" does not exist') ||
        (errorMessage.includes("relation") && errorMessage.includes("does not exist"))
      ) {
        setTableExists(false)
      } else {
        setApiError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }

      // Set empty array as fallback
      setTodos([])
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (todo: { title: string; description?: string }) => {
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      })

      if (!response.ok) {
        throw new Error("Failed to add todo")
      }

      const newTodo = await response.json()
      setTodos([newTodo, ...todos])
      toast({
        title: "Success",
        description: "Todo added successfully",
      })
    } catch (error) {
      console.error("Error adding todo:", error)
      toast({
        title: "Error",
        description: "Failed to add todo. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error("Failed to update todo")
      }

      const updatedTodo = await response.json()
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)))
      toast({
        title: "Success",
        description: "Todo updated successfully",
      })
    } catch (error) {
      console.error("Error updating todo:", error)
      toast({
        title: "Error",
        description: "Failed to update todo. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete todo")
      }

      setTodos(todos.filter((todo) => todo.id !== id))
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting todo:", error)
      toast({
        title: "Error",
        description: "Failed to delete todo. Please try again.",
        variant: "destructive",
      })
    }
  }

  const summarizeAndSendToSlack = async () => {
    if (!slackWebhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a Slack webhook URL",
        variant: "destructive",
      })
      return
    }

    // Save webhook URL to localStorage
    localStorage.setItem("slackWebhookUrl", slackWebhookUrl)

    setSummarizing(true)
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slackWebhookUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to summarize todos")
      }

      toast({
        title: "Success",
        description: `Summary of ${data.todoCount} todos sent to Slack successfully!`,
      })
    } catch (error) {
      console.error("Error summarizing todos:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to summarize todos",
        variant: "destructive",
      })
    } finally {
      setSummarizing(false)
    }
  }

  const pendingTodos = todos.filter((todo) => !todo.completed)
  const completedTodos = todos.filter((todo) => todo.completed)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium">Loading...</p>
      </div>
    )
  }

  if (!tableExists) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Database Table Not Found
          </CardTitle>
          <CardDescription>The todos table needs to be created in your Supabase database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The application couldn't find the <code>todos</code> table in your Supabase database. You need to create
            this table before you can use the app.
          </p>

          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">How to create the table:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to your Supabase dashboard</li>
              <li>Select your project</li>
              <li>Go to the SQL Editor</li>
              <li>Create a new query</li>
              <li>Copy and paste the SQL below</li>
              <li>Run the query</li>
            </ol>
          </div>

          <div className="bg-slate-800 text-slate-100 p-4 rounded-md overflow-x-auto text-sm">
            <pre>{`CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}</pre>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={fetchTodos}>Refresh</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {apiError ? (
        <ApiErrorFallback onRetry={fetchTodos} error={apiError} />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Add New Todo</CardTitle>
              <CardDescription>Create a new task to keep track of</CardDescription>
            </CardHeader>
            <CardContent>
              <TodoForm onSubmit={addTodo} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summarize & Send to Slack</CardTitle>
              <CardDescription>Generate an AI summary of your pending todos and send it to Slack</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    type="url"
                    placeholder="Enter your Slack webhook URL"
                    value={slackWebhookUrl}
                    onChange={(e) => setSlackWebhookUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={summarizeAndSendToSlack} disabled={summarizing || pendingTodos.length === 0}>
                    {summarizing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Summarizing...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Summarize & Send
                      </>
                    )}
                  </Button>
                </div>
                {pendingTodos.length === 0 && (
                  <p className="text-sm text-muted-foreground">No pending todos to summarize</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Todos</CardTitle>
              <CardDescription>Manage your tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending">
                <TabsList className="mb-4">
                  <TabsTrigger value="pending">Pending ({pendingTodos.length})</TabsTrigger>
                  <TabsTrigger value="completed">Completed ({completedTodos.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="pending">
                  <TodoList todos={pendingTodos} onUpdate={updateTodo} onDelete={deleteTodo} loading={loading} />
                </TabsContent>

                <TabsContent value="completed">
                  <TodoList todos={completedTodos} onUpdate={updateTodo} onDelete={deleteTodo} loading={loading} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
