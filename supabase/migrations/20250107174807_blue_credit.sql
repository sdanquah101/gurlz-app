/*
  # Add Face Verification Insert Policy

  1. Changes
    - Add policy to allow users to insert face verification records
    - Add policy to allow users to update their own verification status
*/

-- Add insert policy for face verifications
CREATE POLICY "Users can create their own face verifications"
ON public.face_verifications
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add update policy for face verifications
CREATE POLICY "Users can update their own verification status"
ON public.face_verifications
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);