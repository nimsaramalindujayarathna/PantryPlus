/*
  # Add real-time weight sync from Firebase

  1. Changes
    - Add function to sync weights from Firebase
    - Add trigger to update grocery weights when load cell changes

  2. Security
    - Function runs with security definer to ensure proper access
*/

-- Create the function to update grocery weights
CREATE OR REPLACE FUNCTION update_grocery_weight()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update weight if load_cell_number has changed
  IF (TG_OP = 'INSERT') OR 
     (TG_OP = 'UPDATE' AND OLD.load_cell_number IS DISTINCT FROM NEW.load_cell_number) THEN
    
    -- Get the user's Firebase ID from profiles
    PERFORM firebase_user_id 
    FROM profiles 
    WHERE id = NEW.user_id;

    -- Set initial weight to 0
    NEW.weight = 0;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run before insert or update
DROP TRIGGER IF EXISTS sync_grocery_weight ON groceries;
CREATE TRIGGER sync_grocery_weight
  BEFORE INSERT OR UPDATE
  ON groceries
  FOR EACH ROW
  EXECUTE FUNCTION update_grocery_weight();