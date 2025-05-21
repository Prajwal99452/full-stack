import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SetupInstructionsPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Todo App Setup Instructions</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Database Setup</CardTitle>
          <CardDescription>Follow these steps to set up your database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Step 1: Access Supabase SQL Editor</h2>
            <p className="text-muted-foreground mb-4">
              Log in to your Supabase account and navigate to the SQL Editor for your project.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Step 2: Create the todos table</h2>
            <p className="text-muted-foreground mb-4">
              Copy the SQL below and paste it into the SQL Editor, then run the query.
            </p>

            <div className="bg-slate-800 text-slate-100 p-4 rounded-md overflow-x-auto">
              <pre className="text-sm">{`CREATE TABLE IF NOT EXISTS todos (
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
  ('Update dependencies', 'Check for security vulnerabilities and update packages', true);`}</pre>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Step 3: Verify the table was created</h2>
            <p className="text-muted-foreground mb-4">
              Run the following SQL query to verify that the table was created successfully:
            </p>

            <div className="bg-slate-800 text-slate-100 p-4 rounded-md overflow-x-auto">
              <pre className="text-sm">{`SELECT * FROM todos;`}</pre>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/" passHref>
            <Button>Return to App</Button>
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting</CardTitle>
          <CardDescription>Common issues and solutions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Permission Issues</h3>
            <p className="text-muted-foreground">
              If you encounter permission errors, make sure your Supabase service role has the necessary permissions to
              create tables.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Table Already Exists</h3>
            <p className="text-muted-foreground">
              If you get an error saying the table already exists, you can safely ignore it. The SQL uses "CREATE TABLE
              IF NOT EXISTS" to prevent errors.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Still Having Issues?</h3>
            <p className="text-muted-foreground">
              Check the Supabase documentation or contact support if you continue to experience problems.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
