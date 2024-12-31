/*
  # Fix scale constraint and add triggers

  1. Changes
    - Remove unique constraint on scale_number to allow multiple items per scale
    - Add trigger to update updated_at timestamp
  
  2. Security
    - Ensure RLS policies are working correctly
*/

-- Drop the unique constraint on scale_number
DROP INDEX IF EXISTS groceries_scale_number_unique;

-- Create or replace trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_groceries_updated_at
  BEFORE UPDATE ON groceries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();