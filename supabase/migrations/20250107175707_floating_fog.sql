/*
  # Final Fix for Face Verification Storage

  1. Storage Bucket
    - Ensure bucket exists and is public
    - Set proper bucket configuration
    - Update RLS policies

  2. Changes
    - Create bucket if not exists
    - Set bucket to public
    - Add proper RLS policies for upload and read access
*/

-- Create bucket if not exists with public access
INSERT INTO storage.buckets (id, name, public)
VALUES ('face-verification', 'face-verification', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable RLS on objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop any conflicting policies
DROP POLICY IF EXISTS "Anyone can read face verification images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload face verification images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own face verification images" ON storage.objects;

-- Create new policies with proper access control
CREATE POLICY "Anyone can read face verification images"
ON storage.objects FOR SELECT
USING (bucket_id = 'face-verification');

CREATE POLICY "Authenticated users can upload face verification images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'face-verification' AND
  auth.role() = 'authenticated'
);