import { FitnessQuestion } from '../types/fitness';

export const fitnessQuestions: FitnessQuestion[] = [
  // Cardiovascular Fitness (8 questions)
  {
    id: 'cv1',
    category: 'cardiovascular',
    question: 'How often do you engage in cardiovascular exercise?',
    options: ['Never', '1-2 times/week', '3-4 times/week', '5+ times/week'],
    weight: 2
  },
  {
    id: 'cv2',
    category: 'cardiovascular',
    question: 'How long can you maintain moderate-intensity cardio without stopping?',
    options: ['Less than 5 minutes', '5-15 minutes', '15-30 minutes', '30+ minutes'],
    weight: 2
  },
  {
    id: 'cv3',
    category: 'cardiovascular',
    question: 'How quickly does your heart rate return to normal after exercise?',
    options: ['Very slowly (10+ min)', 'Slowly (5-10 min)', 'Moderately (3-5 min)', 'Quickly (1-2 min)'],
    weight: 1
  },
  {
    id: 'cv4',
    category: 'cardiovascular',
    question: 'Can you climb several flights of stairs without getting winded?',
    options: ['No', 'With great difficulty', 'With some difficulty', 'Easily'],
    weight: 1
  },
  {
    id: 'cv5',
    category: 'cardiovascular',
    question: 'What is your typical resting heart rate?',
    options: ['Above 100 bpm', '80-100 bpm', '60-80 bpm', 'Below 60 bpm'],
    weight: 1
  },
  {
    id: 'cv6',
    category: 'cardiovascular',
    question: 'How often do you feel short of breath during daily activities?',
    options: ['Very often', 'Often', 'Sometimes', 'Rarely'],
    weight: 1
  },
  {
    id: 'cv7',
    category: 'cardiovascular',
    question: 'What intensity level can you maintain during cardio?',
    options: ['Light only', 'Moderate', 'Vigorous', 'High-intensity intervals'],
    weight: 1
  },
  {
    id: 'cv8',
    category: 'cardiovascular',
    question: 'How far can you run/jog continuously?',
    options: ['Cannot run', 'Less than 1km', '1-3km', '3km+'],
    weight: 1
  },

  // Muscular Strength (8 questions)
  {
    id: 'st1',
    category: 'strength',
    question: 'How many push-ups can you do consecutively?',
    options: ['None', '1-5', '6-15', '15+'],
    weight: 2
  },
  {
    id: 'st2',
    category: 'strength',
    question: 'How many bodyweight squats can you perform with proper form?',
    options: ['Less than 5', '5-15', '15-25', '25+'],
    weight: 2
  },
  {
    id: 'st3',
    category: 'strength',
    question: 'Can you do a plank? If so, for how long?',
    options: ['Cannot do', '10-30 seconds', '30-60 seconds', '60+ seconds'],
    weight: 1
  },
  {
    id: 'st4',
    category: 'strength',
    question: 'How often do you perform strength training exercises?',
    options: ['Never', 'Occasionally', '1-2 times/week', '3+ times/week'],
    weight: 1
  },
  {
    id: 'st5',
    category: 'strength',
    question: 'Can you carry heavy groceries without difficulty?',
    options: ['No', 'With great difficulty', 'With some effort', 'Easily'],
    weight: 1
  },
  {
    id: 'st6',
    category: 'strength',
    question: 'How many pull-ups/assisted pull-ups can you do?',
    options: ['None', '1-3', '4-8', '8+'],
    weight: 1
  },
  {
    id: 'st7',
    category: 'strength',
    question: 'Can you get up from the floor without using your hands?',
    options: ['No', 'With great difficulty', 'With some effort', 'Easily'],
    weight: 1
  },
  {
    id: 'st8',
    category: 'strength',
    question: 'How would you rate your overall strength?',
    options: ['Poor', 'Fair', 'Good', 'Excellent'],
    weight: 1
  },

  // Muscular Endurance (8 questions)
  {
    id: 'en1',
    category: 'endurance',
    question: 'How long can you maintain a wall sit?',
    options: ['Less than 15 sec', '15-30 sec', '30-60 sec', '60+ sec'],
    weight: 2
  },
  {
    id: 'en2',
    category: 'endurance',
    question: 'How many squats can you do in 2 minutes?',
    options: ['Less than 20', '20-40', '40-60', '60+'],
    weight: 2
  },
  {
    id: 'en3',
    category: 'endurance',
    question: 'How long can you jump rope continuously?',
    options: ['Cannot do', '30 sec', '1-2 min', '2+ min'],
    weight: 1
  },
  {
    id: 'en4',
    category: 'endurance',
    question: 'Can you complete a 1-hour workout without excessive fatigue?',
    options: ['No', 'With great difficulty', 'With some effort', 'Easily'],
    weight: 1
  },
  {
    id: 'en5',
    category: 'endurance',
    question: 'How many flights of stairs can you climb before needing rest?',
    options: ['1 flight', '2-3 flights', '4-5 flights', '6+ flights'],
    weight: 1
  },
  {
    id: 'en6',
    category: 'endurance',
    question: 'How long can you maintain a moderate pace walk?',
    options: ['Less than 10 min', '10-20 min', '20-40 min', '40+ min'],
    weight: 1
  },
  {
    id: 'en7',
    category: 'endurance',
    question: 'How quickly do you fatigue during daily activities?',
    options: ['Very quickly', 'Quickly', 'Moderately', 'Rarely'],
    weight: 1
  },
  {
    id: 'en8',
    category: 'endurance',
    question: 'How many push-ups can you do in 1 minute?',
    options: ['Less than 5', '5-15', '15-25', '25+'],
    weight: 1
  },

  // Flexibility (8 questions)
  {
    id: 'fl1',
    category: 'flexibility',
    question: 'Can you touch your toes while standing?',
    options: ['Not close', 'Almost', 'Just barely', 'Easily'],
    weight: 2
  },
  {
    id: 'fl2',
    category: 'flexibility',
    question: 'How often do you stretch?',
    options: ['Never', 'Occasionally', '2-3 times/week', 'Daily'],
    weight: 2
  },
  {
    id: 'fl3',
    category: 'flexibility',
    question: 'Can you do a full squat with heels on the ground?',
    options: ['No', 'Partially', 'Almost', 'Yes'],
    weight: 1
  },
  {
    id: 'fl4',
    category: 'flexibility',
    question: 'How flexible are your shoulders?',
    options: ['Very stiff', 'Somewhat stiff', 'Moderately flexible', 'Very flexible'],
    weight: 1
  },
  {
    id: 'fl5',
    category: 'flexibility',
    question: 'Can you sit cross-legged comfortably?',
    options: ['No', 'Briefly', 'For some time', 'Indefinitely'],
    weight: 1
  },
  {
    id: 'fl6',
    category: 'flexibility',
    question: 'Can you reach behind your back and touch your shoulder blades?',
    options: ['No', 'One side only', 'Almost touch', 'Yes, easily'],
    weight: 1
  },
  {
    id: 'fl7',
    category: 'flexibility',
    question: 'How often do you experience muscle tightness?',
    options: ['Very often', 'Often', 'Sometimes', 'Rarely'],
    weight: 1
  },
  {
    id: 'fl8',
    category: 'flexibility',
    question: 'Can you do a lunge without knee pain?',
    options: ['No', 'With difficulty', 'Most times', 'Always'],
    weight: 1
  },

  // Body Composition (8 questions)
  {
    id: 'cp1',
    category: 'composition',
    question: 'How would you describe your body composition?',
    options: ['Overweight', 'Could improve', 'Healthy', 'Athletic'],
    weight: 2
  },
  {
    id: 'cp2',
    category: 'composition',
    question: 'How often do you engage in resistance training?',
    options: ['Never', 'Occasionally', '1-2 times/week', '3+ times/week'],
    weight: 2
  },
  {
    id: 'cp3',
    category: 'composition',
    question: 'How would you rate your muscle definition?',
    options: ['Poor', 'Fair', 'Good', 'Excellent'],
    weight: 1
  },
  {
    id: 'cp4',
    category: 'composition',
    question: 'How stable is your weight?',
    options: ['Very unstable', 'Somewhat unstable', 'Mostly stable', 'Very stable'],
    weight: 1
  },
  {
    id: 'cp5',
    category: 'composition',
    question: 'How would you rate your overall body fat percentage?',
    options: ['High', 'Above average', 'Average', 'Athletic'],
    weight: 1
  },
  {
    id: 'cp6',
    category: 'composition',
    question: 'How often do you eat protein-rich foods?',
    options: ['Rarely', 'Sometimes', 'Often', 'Every meal'],
    weight: 1
  },
  {
    id: 'cp7',
    category: 'composition',
    question: 'How would you rate your muscle mass?',
    options: ['Low', 'Below average', 'Average', 'Above average'],
    weight: 1
  },
  {
    id: 'cp8',
    category: 'composition',
    question: 'How balanced is your diet?',
    options: ['Poor', 'Fair', 'Good', 'Excellent'],
    weight: 1
  }
];