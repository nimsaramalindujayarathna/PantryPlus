/*
  # Initial Schema Setup for Pantry Plus

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `first_name` (text)
      - `last_name` (text)
      - `updated_at` (timestamp)
    - `groceries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `expiry_date` (date)
      - `scale_number` (int)
      - `weight` (decimal)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  first_name text,
  last_name text,
  updated_at timestamptz DEFAULT now()
);

-- Create groceries table
CREATE TABLE groceries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  expiry_date date NOT NULL,
  scale_number int NOT NULL CHECK (scale_number BETWEEN 1 AND 4),
  weight decimal DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE groceries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Groceries policies
CREATE POLICY "Users can view own groceries"
  ON groceries FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own groceries"
  ON groceries FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own groceries"
  ON groceries FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own groceries"
  ON groceries FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create unique constraint for scale assignment
CREATE UNIQUE INDEX groceries_scale_number_unique 
  ON groceries (scale_number) 
  WHERE scale_number IS NOT NULL;