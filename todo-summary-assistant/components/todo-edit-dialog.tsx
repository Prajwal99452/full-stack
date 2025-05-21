"use client"

import type { Todo, TodoFormData } from "@/types/todo"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import TodoForm from "./todo-form"

interface TodoEditDialogProps {
  todo: Todo
  open: boolean
  onClose: () => void
  onSave: (updates: TodoFormData) => Promise<void>
}

export default function TodoEditDialog({ todo, open, onClose, onSave }: TodoEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
        </DialogHeader>
        <TodoForm
          initialData={{
            title: todo.title,
            description: todo.description || undefined,
          }}
          onSubmit={onSave}
        />
      </DialogContent>
    </Dialog>
  )
}
