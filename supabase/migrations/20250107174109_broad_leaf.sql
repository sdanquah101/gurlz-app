/*
  # Face Verification Schema

  1. New Tables
    - `face_verifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `face_image_url` (text)
      - `verification_status` (text)
      - `verified_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create face verifications table
CREATE TABLE IF NOT EXISTS public.face_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles ON DELETE CASCADE,
  face_image_url text NOT NULL,
  verification_status text NOT NULL CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.face_verifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own verifications"
  ON public.face_verifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own verifications"
  ON public.face_verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);