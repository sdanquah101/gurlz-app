/*
  # Chat System Schema

  1. New Tables
    - `chat_rooms`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category` (text)
      - `created_at` (timestamptz)
      - `created_by` (uuid, references profiles)
    
    - `chat_messages`
      - `id` (uuid, primary key)
      - `room_id` (uuid, references chat_rooms)
      - `user_id` (uuid, references profiles)
      - `content` (text)
      - `is_anonymous` (boolean)
      - `is_suitable_for_minors` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `message_likes`
      - `message_id` (uuid, references chat_messages)
      - `user_id` (uuid, references profiles)
      - `created_at` (timestamptz)
      - Primary key (message_id, user_id)
    
    - `message_comments`
      - `id` (uuid, primary key)
      - `message_id` (uuid, references chat_messages)
      - `user_id` (uuid, references profiles)
      - `content` (text)
      - `is_anonymous` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Chat Rooms Table
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES public.profiles(id)
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_anonymous boolean DEFAULT false,
  is_suitable_for_minors boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Message Likes Table
CREATE TABLE IF NOT EXISTS public.message_likes (
  message_id uuid REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (message_id, user_id)
);

-- Message Comments Table
CREATE TABLE IF NOT EXISTS public.message_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_anonymous boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_comments ENABLE ROW LEVEL SECURITY;

-- Chat Rooms Policies
CREATE POLICY "Anyone can view chat rooms"
  ON public.chat_rooms
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create chat rooms"
  ON public.chat_rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Chat Messages Policies
CREATE POLICY "Anyone can view messages"
  ON public.chat_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create messages"
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

CREATE POLICY "Authenticated users can like messages"
  ON public.message_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their likes"
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

CREATE POLICY "Authenticated users can create comments"
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
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON public.chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_message_likes_message_id ON public.message_likes(message_id);
CREATE INDEX IF NOT EXISTS idx_message_comments_message_id ON public.message_comments(message_id);