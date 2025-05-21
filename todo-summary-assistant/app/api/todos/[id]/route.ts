import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/todos/:id - Get a specific todo
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const id = params.id

  const { data, error } = await supabase.from("todos").select("*").eq("id", id).single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 })
  }

  return NextResponse.json(data)
}

// PATCH /api/todos/:id - Update a todo
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const id = params.id
  const body = await request.json()

  const { data, error } = await supabase
    .from("todos")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 })
  }

  return NextResponse.json(data[0])
}

// DELETE /api/todos/:id - Delete a todo
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const id = params.id

  const { error } = await supabase.from("todos").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
