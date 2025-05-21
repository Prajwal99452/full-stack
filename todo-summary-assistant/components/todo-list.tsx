"use client"

import type { Todo } from "@/types/todo"
import { Checkbox } from "./ui/checkbox"
import { Button } from "./ui/button"
import { Trash2, Pencil, Loader2 } from "lucide-react"
import { useState } from "react"
import TodoEditDialog from "./todo-edit-dialog"

interface TodoListProps {
  todos: Todo[]
  onUpdate: (id: string, updates: Partial<Todo>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  loading: boolean
}

export default function TodoList({ todos, onUpdate, onDelete, loading }: TodoListProps) {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  const handleToggleComplete = async (todo: Todo) => {
    setProcessingIds((prev) => new Set(prev).add(todo.id))
    await onUpdate(todo.id, { completed: !todo.completed })
    setProcessingIds((prev) => {
      const newSet = new Set(prev)
      newSet.delete(todo.id)
      return newSet
    })
  }

  const handleDelete = async (id: string) => {
    setProcessingIds((prev) => new Set(prev).add(id))
    await onDelete(id)
    setProcessingIds((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (todos.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No todos found</div>
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <div key={todo.id} className="flex items-start justify-between p-4 border rounded-lg bg-card">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => handleToggleComplete(todo)}
              disabled={processingIds.has(todo.id)}
              className="mt-1"
            />
            <div className="space-y-1 flex-1">
              <p className={`font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                {todo.title}
              </p>
              {todo.description && (
                <p
                  className={`text-sm ${todo.completed ? "line-through text-muted-foreground" : "text-muted-foreground"}`}
                >
                  {todo.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setEditingTodo(todo)}
              disabled={processingIds.has(todo.id)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDelete(todo.id)}
              disabled={processingIds.has(todo.id)}
            >
              {processingIds.has(todo.id) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      ))}

      {editingTodo && (
        <TodoEditDialog
          todo={editingTodo}
          open={!!editingTodo}
          onClose={() => setEditingTodo(null)}
          onSave={async (updates) => {
            await onUpdate(editingTodo.id, updates)
            setEditingTodo(null)
          }}
        />
      )}
    </div>
  )
}
