/*
  # Add code preview support
  
  1. Changes
    - Add code_content column to store executable code
    - Add language column to specify the code type
    - Add has_preview flag to enable/disable previews
    
  2. Security
    - Enable RLS
    - Add policy for reading code content
*/

ALTER TABLE projects
ADD COLUMN code_content text,
ADD COLUMN language text CHECK (language IN ('python', 'html', 'javascript')),
ADD COLUMN has_preview boolean DEFAULT false;

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow reading code content for preview
CREATE POLICY "Allow reading code content for preview"
ON projects
FOR SELECT
TO authenticated
USING (has_preview = true);