/*
  # Add Firebase User ID to profiles

  1. Changes
    - Add firebase_user_id column to profiles table
    - Add unique constraint to ensure one-to-one mapping
*/

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS firebase_user_id text UNIQUE;

-- Update types for the profiles table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';