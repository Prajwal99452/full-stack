import { createClient } from "./server"

export async function ensureDatabaseSchema() {
  const supabase = createClient()

  // Check if the todos table exists
  const { error: checkError } = await supabase.from("todos").select("id").limit(1)

  // If we get a specific error about the relation not existing, create the table
  if (checkError && checkError.message.includes("relation") && checkError.message.includes("does not exist")) {
    console.log("Creating todos table...")

    // Create the todos table
    const { error: createError } = await supabase.rpc("create_todos_table", {})

    if (createError) {
      // If RPC fails (which it might if not set up), try direct SQL
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
        console.error("Failed to create todos table:", sqlError)
        throw new Error(`Failed to create database schema: ${sqlError.message}`)
      }
    }

    console.log("Todos table created successfully")
  } else if (checkError) {
    // If there's a different error, log it but don't throw
    console.warn("Error checking todos table:", checkError)
  }

  return { success: true }
}
