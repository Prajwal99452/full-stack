import { NextResponse } from "next/server"
import { ensureDatabaseSchema } from "@/lib/supabase/schema"

export async function GET() {
  try {
    await ensureDatabaseSchema()

    return NextResponse.json({
      success: true,
      message: "Database schema initialized successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to initialize database schema",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
