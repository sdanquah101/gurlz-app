export interface MealSuggestion {
  name: string;
  ingredients: string[];
  instructions?: string[];
}

export interface MealOptions {
  quick: MealSuggestion[];
  medium: MealSuggestion[];
}

export interface MealSuggestions {
  beginner: MealOptions;
  intermediate: MealOptions;
  advanced: MealOptions;
}

export interface QuizAnswers {
  ingredients: string[];
  dietary: string[];
  cooking: string[];
  time: string[];
}