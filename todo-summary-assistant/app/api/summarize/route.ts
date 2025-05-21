import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { slackWebhookUrl } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 })
    }

    if (!slackWebhookUrl) {
      return NextResponse.json({ error: "Slack webhook URL is required" }, { status: 400 })
    }

    // Get all incomplete todos
    const { data: todos, error } = await supabase.from("todos").select("*").eq("completed", false)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!todos || todos.length === 0) {
      return NextResponse.json({ message: "No pending todos to summarize" }, { status: 200 })
    }

    // Format todos for the AI prompt
    const todoList = todos.map((todo) => `- ${todo.title}${todo.description ? `: ${todo.description}` : ""}`).join("\n")

    // Generate summary using OpenAI
    const { text: summary } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: `Summarize the following todo list in a concise and meaningful way. Provide insights about priorities, themes, and suggestions if possible:\n\n${todoList}`,
    })

    // Send to Slack
    const slackResponse = await fetch(slackWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: `*Todo Summary*\n\n${summary}\n\n*Original Todo List:*\n${todoList}`,
      }),
    })

    if (!slackResponse.ok) {
      return NextResponse.json(
        {
          error: "Failed to send message to Slack",
          slackError: await slackResponse.text(),
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Summary sent to Slack successfully",
      summary,
      todoCount: todos.length,
    })
  } catch (error) {
    console.error("Error in summarize endpoint:", error)
    return NextResponse.json(
      {
        error: "Failed to generate summary or send to Slack",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
