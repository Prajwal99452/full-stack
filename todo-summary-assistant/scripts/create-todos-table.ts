// This is a script that can be run manually to create the todos table
// You can run it with: npx tsx scripts/create-todos-table.ts

import { createClient } from "@supabase/supabase-js"

async function createTodosTable() {
  // Replace these with your actual Supabase credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!supabaseUrl || !supabaseKey) {
    console.error(
      "Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.",
    )
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log("Creating todos table...")

  try {
    const { error } = await supabase.sql`
      CREATE TABLE IF NOT EXISTS todos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    if (error) {
      console.error("Error creating todos table:", error)
      process.exit(1)
    }

    console.log("Todos table created successfully!")
  } catch (error) {
    console.error("Error creating todos table:", error)
    process.exit(1)
  }
}

createTodosTable()
