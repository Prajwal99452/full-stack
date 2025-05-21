-- Run this SQL in your Supabase SQL editor to create the todos table

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
