/*
  # Fix Face Verification Storage Access

  1. Storage
    - Update face-verification bucket settings
    - Add proper storage policies for authenticated users
    - Enable public access for verification images

  2. Changes
    - Set bucket to public
    - Update storage policies for better access control
    - Add policy for authenticated users to upload
*/

-- Update bucket settings
UPDATE storage.buckets 
SET public = true
WHERE id = 'face-verification';

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can upload their own face verification images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read face verification images" ON storage.objects;

-- Create new policies
CREATE POLICY "Anyone can read face verification images"
ON storage.objects FOR SELECT
USING (bucket_id = 'face-verification');

CREATE POLICY "Authenticated users can upload face verification images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'face-verification' AND
  (storage.foldername(name))[1] = auth.uid()::text
);