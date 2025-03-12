/*
  # Fitness Assessment Schema

  1. New Tables
    - fitness_assessments: Stores assessment results
    - fitness_questions: Stores assessment questions
    - fitness_answers: Stores user answers
    - fitness_progress: Tracks user progress over time

  2. Categories
    - Cardiovascular Endurance
    - Muscular Strength
    - Muscular Endurance
    - Flexibility
    - Body Composition

  3. Security
    - Enable RLS
    - Add policies for user data protection
*/

-- Create fitness questions table
CREATE TABLE IF NOT EXISTS public.fitness_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN (
    'cardiovascular',
    'strength',
    'endurance',
    'flexibility',
    'composition'
  )),
  question text NOT NULL,
  options jsonb NOT NULL,
  weight integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create fitness assessments table
CREATE TABLE IF NOT EXISTS public.fitness_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_score integer NOT NULL,
  cardiovascular_score integer NOT NULL,
  strength_score integer NOT NULL,
  endurance_score integer NOT NULL,
  flexibility_score integer NOT NULL,
  composition_score integer NOT NULL,
  completed_at timestamptz DEFAULT now()
);

-- Create fitness answers table
CREATE TABLE IF NOT EXISTS public.fitness_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES public.fitness_assessments(id) ON DELETE CASCADE,
  question_id uuid REFERENCES public.fitness_questions(id) ON DELETE CASCADE,
  answer text NOT NULL,
  score integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create fitness progress table
CREATE TABLE IF NOT EXISTS public.fitness_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  assessment_date timestamptz DEFAULT now(),
  category text NOT NULL CHECK (category IN (
    'cardiovascular',
    'strength',
    'endurance',
    'flexibility',
    'composition'
  )),
  score integer NOT NULL,
  improvement_percentage decimal,
  notes text
);

-- Enable RLS
ALTER TABLE public.fitness_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view questions"
  ON public.fitness_questions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their own assessments"
  ON public.fitness_assessments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessments"
  ON public.fitness_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

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

CREATE POLICY "Users can view their own progress"
  ON public.fitness_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress"
  ON public.fitness_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_fitness_assessments_user_id ON public.fitness_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_fitness_answers_assessment_id ON public.fitness_answers(assessment_id);
CREATE INDEX IF NOT EXISTS idx_fitness_progress_user_id ON public.fitness_progress(user_id);