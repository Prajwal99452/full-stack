"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import type { TodoFormData } from "@/types/todo"
import { Loader2 } from "lucide-react"

interface TodoFormProps {
  onSubmit: (data: TodoFormData) => Promise<void>
  initialData?: TodoFormData
}

export default function TodoForm({ onSubmit, initialData }: TodoFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setSubmitting(true)
    try {
      await onSubmit({ title, description: description || undefined })
      if (!initialData) {
        // Only clear form if this is a new todo form, not an edit form
        setTitle("")
        setDescription("")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input placeholder="Todo title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      <Button type="submit" disabled={submitting || !title.trim()}>
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : initialData ? (
          "Update Todo"
        ) : (
          "Add Todo"
        )}
      </Button>
    </form>
  )
}
