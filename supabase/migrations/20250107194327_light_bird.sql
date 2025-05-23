/*
  # Fix Chat System Dependencies

  1. Changes
    - Drop view before dropping tables
    - Recreate tables and view in correct order
    - Ensure all dependencies are properly handled

  2. Security
    - Maintain existing RLS policies
    - Keep age-appropriate content filtering
*/

-- First drop the view that depends on chat_messages
DROP VIEW IF EXISTS public.age_appropriate_messages;

-- Then drop the tables in correct order
DROP TABLE IF EXISTS public.message_comments;
DROP TABLE IF EXISTS public.message_likes;
DROP TABLE IF EXISTS public.chat_messages;

-- Recreate chat messages table
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_anonymous boolean DEFAULT false,
  is_suitable_for_minors boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create message likes table
CREATE TABLE public.message_likes (
  message_id uuid REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (message_id, user_id)
);

-- Create message comments table
CREATE TABLE public.message_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_anonymous boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Recreate the view for age-appropriate messages
CREATE OR REPLACE VIEW public.age_appropriate_messages AS
SELECT m.*
FROM public.chat_messages m
WHERE 
  m.is_suitable_for_minors = true 
  OR (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() 
      AND p.age_group != '12-18'
    )
  );

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_comments ENABLE ROW LEVEL SECURITY;

-- Chat Messages Policies
CREATE POLICY "Anyone can view age-appropriate messages"
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

CREATE POLICY "Users can create messages"
  ON public.chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages"
  ON public.chat_messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
  ON public.chat_messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Message Likes Policies
CREATE POLICY "Anyone can view likes"
  ON public.message_likes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like messages"
  ON public.message_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their likes"
  ON public.message_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Message Comments Policies
CREATE POLICY "Anyone can view comments"
  ON public.message_comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON public.message_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.message_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
CREATE TRIGGER update_chat_messages_updated_at
  BEFORE UPDATE ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
CREATE INDEX idx_message_likes_message_id ON public.message_likes(message_id);
CREATE INDEX idx_message_comments_message_id ON public.message_comments(message_id);
CREATE INDEX idx_chat_messages_suitable_minors ON public.chat_messages(is_suitable_for_minors);

-- Enable realtime for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE message_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE message_comments;