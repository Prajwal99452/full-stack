import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ensureDatabaseSchema } from "@/lib/supabase/schema"

export async function GET() {
  try {
    // Try to initialize the database schema
    try {
      await ensureDatabaseSchema()
    } catch (schemaError) {
      console.warn("Schema initialization warning:", schemaError)
    }

    // Check if we can connect to Supabase
    const supabase = createClient()
    const { error } = await supabase.from("todos").select("id").limit(1)

    // If the error is about the relation not existing, that's a schema issue
    if (error && error.message.includes("relation") && error.message.includes("does not exist")) {
      return NextResponse.json(
        {
          status: "error",
          message: "Database schema not initialized",
          error: error.message,
          env: {
            supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            supabaseKey: !!process.env.SUPABASE_ANON_KEY || !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          },
        },
        { status: 500 },
      )
    } else if (error) {
      return NextResponse.json(
        {
          status: "error",
          message: "Database connection failed",
          error: error.message,
          env: {
            supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            supabaseKey: !!process.env.SUPABASE_ANON_KEY || !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          },
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      status: "ok",
      message: "API is healthy",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
