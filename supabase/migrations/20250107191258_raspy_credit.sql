/*
  # Add Age Group to Profiles

  1. Changes
    - Add age_group column to profiles table
    - Update existing profiles to default age group
    - Add check constraint for valid age groups

  2. Security
    - Maintain existing RLS policies
*/

-- Add age_group column with check constraint
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS age_group text 
CHECK (age_group IN ('12-18', '19-25', '26-30', '31-35', '35+'));

-- Set default age group for existing profiles
UPDATE public.profiles 
SET age_group = '19-25'
WHERE age_group IS NULL;

-- Make age_group required
ALTER TABLE public.profiles 
ALTER COLUMN age_group SET NOT NULL;

-- Update handle_new_user function to include age_group
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    gender,
    country,
    phone_number,
    user_type,
    age_group
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
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'age_group',
      '19-25'
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;