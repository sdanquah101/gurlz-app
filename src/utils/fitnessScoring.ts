import { FitnessAnswer, FitnessRecommendation } from '../types/fitness';
import { fitnessQuestions } from './fitnessQuestions';

export function calculateFitnessScore(answers: Record<string, string>): Record<string, number> {
  const categories = ['cardiovascular', 'strength', 'endurance', 'flexibility', 'composition'];
  const scores: Record<string, number> = {
    overall: 0
  };

  // Calculate score for each category
  categories.forEach(category => {
    const categoryQuestions = fitnessQuestions.filter(q => q.category === category);
    let totalWeight = 0;
    let weightedScore = 0;

    categoryQuestions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const options = question.options;
        const answerIndex = options.indexOf(answer);
        const score = ((answerIndex + 1) / options.length) * 100;
        weightedScore += score * question.weight;
        totalWeight += question.weight;
      }
    });

    scores[category] = totalWeight > 0 ? weightedScore / totalWeight : 0;
  });

  // Calculate overall score (weighted average of all categories)
  scores.overall = categories.reduce((acc, category) => acc + scores[category], 0) / categories.length;

  return scores;
}

export function getRecommendations(scores: Record<string, number>): FitnessRecommendation[] {
  const recommendations: FitnessRecommendation[] = [];

  // Cardiovascular recommendations
  if (scores.cardiovascular < 40) {
    recommendations.push({
      category: 'cardiovascular',
      text: 'Start with walking 15-20 minutes daily and gradually increase duration and intensity',
      priority: 'high'
    });
  } else if (scores.cardiovascular < 70) {
    recommendations.push({
      category: 'cardiovascular',
      text: 'Incorporate interval training and increase workout frequency',
      priority: 'medium'
    });
  }

  // Strength recommendations
  if (scores.strength < 40) {
    recommendations.push({
      category: 'strength',
      text: 'Begin with bodyweight exercises focusing on proper form',
      priority: 'high'
    });
  } else if (scores.strength < 70) {
    recommendations.push({
      category: 'strength',
      text: 'Add progressive resistance training 2-3 times per week',
      priority: 'medium'
    });
  }

  // Endurance recommendations
  if (scores.endurance < 40) {
    recommendations.push({
      category: 'endurance',
      text: 'Focus on building basic endurance through consistent activity',
      priority: 'high'
    });
  } else if (scores.endurance < 70) {
    recommendations.push({
      category: 'endurance',
      text: 'Increase duration of workouts and add circuit training',
      priority: 'medium'
    });
  }

  // Flexibility recommendations
  if (scores.flexibility < 40) {
    recommendations.push({
      category: 'flexibility',
      text: 'Incorporate daily stretching routine focusing on major muscle groups',
      priority: 'high'
    });
  } else if (scores.flexibility < 70) {
    recommendations.push({
      category: 'flexibility',
      text: 'Add yoga or dynamic stretching to your routine',
      priority: 'medium'
    });
  }

  // Body composition recommendations
  if (scores.composition < 40) {
    recommendations.push({
      category: 'composition',
      text: 'Focus on balanced nutrition and regular exercise for healthy body composition',
      priority: 'high'
    });
  } else if (scores.composition < 70) {
    recommendations.push({
      category: 'composition',
      text: 'Optimize protein intake and resistance training for muscle maintenance',
      priority: 'medium'
    });
  }

  return recommendations;
}