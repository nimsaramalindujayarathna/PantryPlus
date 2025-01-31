-- Create a function to handle real-time weight updates
CREATE OR REPLACE FUNCTION handle_weight_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the grocery weight in Supabase
  UPDATE groceries
  SET 
    weight = NEW.weight,
    updated_at = CURRENT_TIMESTAMP
  WHERE 
    user_id IN (
      SELECT id 
      FROM profiles 
      WHERE firebase_user_id = TG_ARGV[0]
    )
    AND load_cell_number = TG_ARGV[1];

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to handle Firebase events
CREATE OR REPLACE FUNCTION sync_firebase_weight(
  firebase_user_id TEXT,
  load_cell_number INTEGER,
  weight DECIMAL
)
RETURNS void AS $$
BEGIN
  -- Update the grocery weight
  UPDATE groceries
  SET 
    weight = weight,
    updated_at = CURRENT_TIMESTAMP
  WHERE 
    user_id IN (
      SELECT id 
      FROM profiles 
      WHERE firebase_user_id = firebase_user_id
    )
    AND load_cell_number = load_cell_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;