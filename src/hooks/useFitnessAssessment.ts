
import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { FitnessQuestion, FitnessAnswer, AssessmentResult } from '../types/fitness';
import { useAuthStore } from '../store/authStore';

export function useFitnessAssessment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore(state => state.user);

  const getQuestions = async (): Promise<FitnessQuestion[]> => {
    try {
      const { data, error } = await supabase
        .from('fitness_questions')
        .select('*')
        .order('category');

      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  const submitAssessment = async (answers: FitnessAnswer[]): Promise<AssessmentResult | null> => {
    if (!user) return null;
    setLoading(true);
    setError(null);

    try {
      // Calculate scores
      const scores = calculateScores(answers);

      // Create assessment
      const { data: assessment, error: assessmentError } = await supabase
        .from('fitness_assessments')
        .insert({
          user_id: user.id,
          ...scores
        })
        .select()
        .single();

      if (assessmentError) throw assessmentError;

      // Save answers
      const { error: answersError } = await supabase
        .from('fitness_answers')
        .insert(
          answers.map(answer => ({
            assessment_id: assessment.id,
            ...answer
          }))
        );

      if (answersError) throw answersError;

      // Calculate and save progress
      const progress = await calculateProgress(scores);

      return {
        assessment,
        answers,
        progress
      };
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getProgress = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('fitness_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('assessment_date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  return {
    loading,
    error,
    getQuestions,
    submitAssessment,
    getProgress
  };
}

// Helper functions
function calculateScores(answers: FitnessAnswer[]) {
  // Calculate category scores and total score
  const scores = {
    cardiovascular_score: 0,
    strength_score: 0,
    endurance_score: 0,
    flexibility_score: 0,
    composition_score: 0
  };

  answers.forEach(answer => {
    const score = answer.score;
    switch (answer.category) {
      case 'cardiovascular':
        scores.cardiovascular_score += score;
        break;
      case 'strength':
        scores.strength_score += score;
        break;
      case 'endurance':
        scores.endurance_score += score;
        break;
      case 'flexibility':
        scores.flexibility_score += score;
        break;
      case 'composition':
        scores.composition_score += score;
        break;
    }
  });

  const total_score = Object.values(scores).reduce((a, b) => a + b, 0);

  return {
    ...scores,
    total_score
  };
}

async function calculateProgress(scores: Record<string, number>) {
  // Calculate improvement percentages based on previous assessment
  // Implementation details...
  return [];
}