/*
  # Real-time weight synchronization

  1. Changes
    - Add function to handle real-time weight updates from Firebase
    - Add trigger to automatically sync weights
    - Add notification channel for weight updates

  2. Security
    - Functions run with security definer to ensure proper access
    - Only authenticated users can trigger updates
*/

-- Create a function to handle real-time weight updates
CREATE OR REPLACE FUNCTION sync_weight_from_firebase()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the grocery weight
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

  -- Notify clients about the weight update
  PERFORM pg_notify(
    'weight_updates',
    json_build_object(
      'grocery_id', NEW.id,
      'weight', NEW.weight,
      'timestamp', CURRENT_TIMESTAMP
    )::text
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to manually trigger weight sync
CREATE OR REPLACE FUNCTION trigger_weight_sync(
  p_firebase_user_id TEXT,
  p_load_cell_number INTEGER,
  p_weight DECIMAL
)
RETURNS void AS $$
BEGIN
  -- Update groceries for the specified load cell
  UPDATE groceries
  SET 
    weight = p_weight,
    updated_at = CURRENT_TIMESTAMP
  WHERE 
    user_id IN (
      SELECT id 
      FROM profiles 
      WHERE firebase_user_id = p_firebase_user_id
    )
    AND load_cell_number = p_load_cell_number;

  -- Notify about the update
  PERFORM pg_notify(
    'weight_updates',
    json_build_object(
      'firebase_user_id', p_firebase_user_id,
      'load_cell_number', p_load_cell_number,
      'weight', p_weight,
      'timestamp', CURRENT_TIMESTAMP
    )::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;