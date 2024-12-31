/*
  # Fix profile policies

  1. Changes
    - Drop existing policies
    - Add new policy to allow profile creation during registration
    - Add policies for viewing and updating own profile
    
  2. Security
    - Ensure users can only access their own profile data
    - Allow profile creation during registration
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authentication users only" ON profiles;
DROP POLICY IF EXISTS "Enable select for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;

-- Create new policies with better names and permissions
CREATE POLICY "Allow users to create their profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);