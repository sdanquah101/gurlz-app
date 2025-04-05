/*
  # Fix Chat Relationships

  1. Changes
    - Add explicit foreign key names for better relationship handling
    - Update indexes for performance
    - Add cascade deletes for cleanup

  2. Security
    - Maintain existing RLS policies
    - Ensure proper access control
*/

-- Rename foreign key constraints for clarity
ALTER TABLE public.chat_messages 
DROP CONSTRAINT IF EXISTS chat_messages_user_id_fkey,
ADD CONSTRAINT chat_messages_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;

ALTER TABLE public.message_comments
DROP CONSTRAINT IF EXISTS message_comments_user_id_fkey,
ADD CONSTRAINT message_comments_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.profiles(id)
  ON DELETE CASCADE;

ALTER TABLE public.message_comments
DROP CONSTRAINT IF EXISTS message_comments_message_id_fkey,
ADD CONSTRAINT message_comments_message_id_fkey
  FOREIGN KEY (message_id)
  REFERENCES public.chat_messages(id)
  ON DELETE CASCADE;

-- Update indexes for better query performance
DROP INDEX IF EXISTS idx_message_comments_message_id;
CREATE INDEX idx_message_comments_message_id_created 
ON public.message_comments(message_id, created_at DESC);

DROP INDEX IF EXISTS idx_chat_messages_created_at;
CREATE INDEX idx_chat_messages_created_suitable 
ON public.chat_messages(created_at DESC, is_suitable_for_minors);