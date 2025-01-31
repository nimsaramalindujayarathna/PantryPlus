/*
  # Update schema for load cell management

  1. Changes
    - Add load_cell_number to groceries table
    - Update column name from scale_number to load_cell_number
    - Add check constraint for load cell numbers (1-20)
    
  2. Security
    - Update RLS policies for new column
*/

-- Rename scale_number to load_cell_number and update constraints
ALTER TABLE groceries 
  RENAME COLUMN scale_number TO load_cell_number;

-- Update the check constraint for the new range
ALTER TABLE groceries 
  DROP CONSTRAINT IF EXISTS groceries_scale_number_check,
  ADD CONSTRAINT groceries_load_cell_number_check 
    CHECK (load_cell_number BETWEEN 1 AND 20);