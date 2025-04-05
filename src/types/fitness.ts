export type FitnessCategory = 'cardiovascular' | 'strength' | 'endurance' | 'flexibility' | 'composition';

export interface FitnessQuestion {
  id: string;
  category: FitnessCategory;
  question: string;
  options: string[];
  weight: number;
}

export interface FitnessAssessment {
  id: string;
  userId: string;
  totalScore: number;
  cardiovascularScore: number;
  strengthScore: number;
  enduranceScore: number;
  flexibilityScore: number;
  compositionScore: number;
  completedAt: Date;
}

export interface FitnessAnswer {
  questionId: string;
  answer: string;
  score: number;
}

export interface FitnessProgress {
  category: FitnessCategory;
  score: number;
  improvementPercentage?: number;
  assessmentDate: Date;
}

export interface AssessmentResult {
  assessment: FitnessAssessment;
  answers: FitnessAnswer[];
  progress: FitnessProgress[];
}
