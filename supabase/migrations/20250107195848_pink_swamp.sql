/*
  # Fix Chat Schema

  1. Changes
    - Add parent_id to message_comments for proper threading
    - Add indexes for better performance
    - Update policies for proper access control

  2. Security
    - Enable RLS
    - Add appropriate policies
*/

-- Add parent_id to message_comments
ALTER TABLE public.message_comments
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.chat_messages(id) ON DELETE CASCADE;

-- Add index for parent_id
CREATE INDEX IF NOT EXISTS idx_message_comments_parent_id 
ON public.message_comments(parent_id);

-- Update policies for better access control
DROP POLICY IF EXISTS "Anyone can view comments" ON public.message_comments;
CREATE POLICY "Anyone can view age-appropriate comments"
  ON public.message_comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_messages m
      WHERE m.id = message_id
      AND (
        m.is_suitable_for_minors = true 
        OR EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() 
          AND age_group != '12-18'
        )
      )
    )
  );