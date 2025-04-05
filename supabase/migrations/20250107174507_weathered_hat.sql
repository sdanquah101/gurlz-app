/*
  # Create Face Verification Storage

  1. Storage Bucket
    - Create bucket for face verification images
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create storage bucket for face verification images
INSERT INTO storage.buckets (id, name)
VALUES ('face-verification', 'face-verification')
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage policies
CREATE POLICY "Users can upload their own face verification images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'face-verification' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can read their own face verification images"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'face-verification' AND
  (storage.foldername(name))[1] = auth.uid()::text
);