-- SQL Setup for Supabase
-- Run this in your Supabase SQL Editor

-- 1. Create the winners table
CREATE TABLE IF NOT EXISTS winners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  username TEXT NOT NULL,
  image_url TEXT NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy to allow anyone to read winners
DROP POLICY IF EXISTS "Allow public read access" ON winners;
CREATE POLICY "Allow public read access" ON winners
  FOR SELECT USING (true);

-- 4. Create a policy to allow anyone to insert winners
DROP POLICY IF EXISTS "Allow public insert access" ON winners;
CREATE POLICY "Allow public insert access" ON winners
  FOR INSERT WITH CHECK (true);

-- 5. Storage Setup (Manual Steps)
-- Go to the "Storage" tab in Supabase dashboard.
-- Create a new bucket named "winners".
-- Set the bucket to "Public".
-- Add a policy to allow public uploads and public viewing.
