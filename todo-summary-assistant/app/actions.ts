"use server"

import { createClient } from "@/lib/supabase/server"

export async function initializeDatabase() {
  const supabase = createClient()

  try {
    console.log("Checking if todos table exists...")

    // Try to query the todos table to see if it exists
    const { error: checkError } = await supabase.from("todos").select("id").limit(1)

    // If the table doesn't exist, create it
    if (checkError && checkError.message.includes('relation "public.todos" does not exist')) {
      console.log("Todos table doesn't exist. Creating it...")

      // Create the todos table using the REST API
      const { error: createError } = await supabase.from("_tables").insert([
        {
          name: "todos",
          schema: "public",
          columns: [
            { name: "id", type: "uuid", is_primary: true, default_value: "gen_random_uuid()" },
            { name: "title", type: "text", is_nullable: false },
            { name: "description", type: "text", is_nullable: true },
            { name: "completed", type: "boolean", default_value: "false" },
            { name: "created_at", type: "timestamptz", default_value: "now()" },
            { name: "updated_at", type: "timestamptz", default_value: "now()" },
          ],
        },
      ])

      if (createError) {
        console.error("Failed to create todos table via REST API:", createError)

        // Try direct SQL as a fallback
        const { error: sqlError } = await supabase.sql`
          CREATE TABLE IF NOT EXISTS todos (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )
        `

        if (sqlError) {
          console.error("Failed to create todos table via SQL:", sqlError)
          return { success: false, error: sqlError.message }
        }
      }

      console.log("Todos table created successfully")
      return { success: true, message: "Table created successfully" }
    } else if (checkError) {
      console.error("Error checking todos table:", checkError)
      return { success: false, error: checkError.message }
    }

    console.log("Todos table already exists")
    return { success: true, message: "Table already exists" }
  } catch (error) {
    console.error("Error in initializeDatabase:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
