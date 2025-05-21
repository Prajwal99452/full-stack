# Todo Summary Assistant

A full-stack application that allows users to create and manage personal to-do items, generate summaries using OpenAI, and send them to Slack.

## Features

- Create, edit, and delete to-do items
- View list of current to-dos with pending and completed tabs
- Generate AI summaries of pending to-dos using OpenAI
- Send the generated summaries to a Slack channel
- Responsive UI built with React and Tailwind CSS

## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **LLM Integration**: OpenAI
- **Slack Integration**: Incoming Webhooks

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- Slack workspace with permission to create webhooks

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
\`\`\`

### Installation

1. Clone the repository:
   \`\`\`
   git clone https://github.com/yourusername/todo-summary-assistant.git
   cd todo-summary-assistant
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Set up the database:
   - Create a new Supabase project
   - **IMPORTANT**: You must manually create the todos table in your Supabase database (see below)

4. Run the development server:
   \`\`\`
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup (REQUIRED)

You **must** create the todos table in your Supabase database before using the app:

1. Go to your [Supabase Dashboard](https://app.supabase.io/)
2. Select your project
3. Go to the SQL Editor
4. Create a new query
5. Copy and paste the following SQL:

\`\`\`sql
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Add some sample data
INSERT INTO todos (title, description, completed)
VALUES 
  ('Complete project documentation', 'Write up the technical specifications and user guide', false),
  ('Review pull requests', 'Check the open PRs and provide feedback', false),
  ('Prepare for demo', 'Create slides and rehearse presentation', false),
  ('Update dependencies', 'Check for security vulnerabilities and update packages', true);
\`\`\`

6. Run the query

### Slack Webhook Setup

1. Go to your Slack workspace
2. Create a new app at [https://api.slack.com/apps](https://api.slack.com/apps)
3. Enable "Incoming Webhooks" feature
4. Create a new webhook for a specific channel
5. Copy the webhook URL and paste it in the application when prompted

## Architecture Decisions

- **Next.js App Router**: Used for both frontend and backend to simplify deployment and development
- **Supabase**: Provides a PostgreSQL database with a simple API for data storage
- **OpenAI Integration**: Uses the AI SDK to generate meaningful summaries of pending todos
- **Slack Webhooks**: Simple integration that doesn't require complex authentication
- **shadcn/ui Components**: Provides accessible and customizable UI components

## Deployment

This application can be deployed on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure the environment variables in Vercel
4. Deploy
5. **IMPORTANT**: After deployment, you still need to manually create the todos table in your Supabase database as described in the Database Setup section

## License

MIT
