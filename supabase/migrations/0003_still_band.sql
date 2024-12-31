/*
  # Fix profiles table RLS policies

  1. Changes
    - Add policy to allow profile creation during registration
    - Ensure authenticated users can manage their own profiles
  
  2. Security
    - Enable RLS
    - Add policies for insert/select/update operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new policies
CREATE POLICY "Enable insert for authentication users only" 
  ON profiles FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable select for users based on user_id" 
  ON profiles FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" 
  ON profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);