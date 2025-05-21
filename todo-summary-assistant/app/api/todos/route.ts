import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/todos - Fetch all todos
export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("todos").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.error("Server error in GET /api/todos:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/todos - Add a new todo
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { title, description } = body

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const { data, error } = await supabase.from("todos").insert([{ title, description }]).select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data?.[0] || null, { status: 201 })
  } catch (err) {
    console.error("Server error in POST /api/todos:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
