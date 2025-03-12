/*
  # Fix Fitness Schema

  1. Changes
    - Update fitness_answers table to match frontend expectations
    - Add proper foreign key constraints
    - Add indexes for performance

  2. Security
    - Enable RLS
    - Add proper access policies
*/

-- Drop and recreate fitness_answers table
DROP TABLE IF EXISTS public.fitness_answers;

CREATE TABLE public.fitness_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES public.fitness_assessments(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  answer text NOT NULL,
  score integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fitness_answers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own answers"
  ON public.fitness_answers
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.fitness_assessments
    WHERE id = assessment_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own answers"
  ON public.fitness_answers
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.fitness_assessments
    WHERE id = assessment_id AND user_id = auth.uid()
  ));

-- Create indexes
CREATE INDEX idx_fitness_answers_assessment ON public.fitness_answers(assessment_id);
CREATE INDEX idx_fitness_answers_question ON public.fitness_answers(question_id);