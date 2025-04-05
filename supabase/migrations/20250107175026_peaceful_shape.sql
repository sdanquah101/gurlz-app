/*
  # Fix Face Verification Storage and Policies

  1. Storage
    - Create face-verification bucket if not exists
    - Set public access for face verification images
    - Add storage policies for upload and read access

  2. Changes
    - Add public access to face verification bucket
    - Update storage policies to allow proper access
*/

-- Enable storage by default
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Create bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('face-verification', 'face-verification', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Update storage policies
DROP POLICY IF EXISTS "Users can upload their own face verification images" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own face verification images" ON storage.objects;

CREATE POLICY "Users can upload their own face verification images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'face-verification' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Anyone can read face verification images"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'face-verification');