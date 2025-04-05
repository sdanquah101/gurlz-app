/*
  # Fix Profile Creation Trigger

  1. Changes
    - Update handle_new_user function to properly handle user metadata
    - Add better error handling
    - Add logging for debugging

  2. Security
    - Maintains existing RLS policies
    - Function remains security definer
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate function with better metadata handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    gender,
    country,
    phone_number,
    user_type
  )
  VALUES (
    NEW.id,
    COALESCE(
      (NEW.raw_user_meta_data->>'username'),
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      LOWER(NEW.raw_user_meta_data->>'gender'),
      'female'
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'country',
      'GH'
    ),
    NEW.raw_user_meta_data->>'phone_number',
    COALESCE(
      NEW.raw_user_meta_data->>'user_type',
      'individual'
    )
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();