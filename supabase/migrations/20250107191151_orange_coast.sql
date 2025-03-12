/*
  # Update Chat Tables Structure

  1. Changes
    - Remove room_id from chat_messages as we have a single chatroom
    - Add is_suitable_for_minors flag to messages
    - Update policies to handle age restrictions

  2. Security
    - Enable RLS on all tables
    - Add policies for age-appropriate content filtering
*/

-- Remove room_id from chat_messages
ALTER TABLE public.chat_messages 
DROP COLUMN IF EXISTS room_id;

-- Drop chat_rooms table since we don't need it
DROP TABLE IF EXISTS public.chat_rooms;

-- Add age restriction view for filtered messages
CREATE OR REPLACE VIEW public.age_appropriate_messages AS
SELECT m.*
FROM public.chat_messages m
JOIN public.profiles p ON p.id = auth.uid()
WHERE 
  m.is_suitable_for_minors = true 
  OR (
    p.age_group != '12-18' 
    OR p.age_group IS NULL
  );

-- Update chat messages policy
DROP POLICY IF EXISTS "Anyone can view messages" ON public.chat_messages;
CREATE POLICY "Age appropriate message access"
  ON public.chat_messages
  FOR SELECT
  TO authenticated
  USING (
    is_suitable_for_minors = true 
    OR (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND age_group != '12-18'
      )
    )
  );

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_messages_suitable_minors 
ON public.chat_messages(is_suitable_for_minors);