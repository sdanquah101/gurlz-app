/****************************************************
 * PERIOD TRACKING & PREDICTION MODEL (TypeScript)
 ****************************************************/

/**
 * Interfaces for clarity
 */
export interface Period {
  start: string; // "YYYY-MM-DD"
  end: string;   // "YYYY-MM-DD"
}

export interface UserData {
  periods: Period[];
}

export interface PredictionResult {
  message: string;
  predictions: {
    predictedNextPeriodStart: Date | null;
    predictedNextPeriodEnd: Date | null;
    estimatedOvulationDate: Date | null;
    fertileWindow: { start: Date; end: Date } | null;
  } | null;
}

/****************************************************
 * HELPER FUNCTIONS
 ****************************************************/

function parseDate(dateString: string): Date {
  return new Date(dateString + "T00:00:00");
}

function dayDifference(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((b.getTime() - a.getTime()) / msPerDay);
}

function average(arr: number[]): number {
  if (!arr || arr.length === 0) return 0;
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return sum / arr.length;
}

/****************************************************
 * 1. Compute Cycle Statistics
 ****************************************************/

function computeCycleStatistics(periods: Period[]) {
  if (!periods || periods.length < 2) {
    return {
      avgCycleLength: null,
      avgPeriodDuration: null,
    };
  }

  const cycleLengths: number[] = [];
  const periodDurations: number[] = [];

  for (let i = 0; i < periods.length; i++) {
    const startDate = parseDate(periods[i].start);
    const endDate = parseDate(periods[i].end);

    const duration = dayDifference(startDate, endDate) + 1;
    periodDurations.push(duration);

    if (i < periods.length - 1) {
      const nextStart = parseDate(periods[i + 1].start);
      const cLen = dayDifference(startDate, nextStart);
      cycleLengths.push(cLen);
    }
  }

  return {
    avgCycleLength: average(cycleLengths),
    avgPeriodDuration: average(periodDurations),
  };
}

/****************************************************
 * 2. MAIN FUNCTION: getCyclePredictions
 ****************************************************/

export function getCyclePredictions(userData: UserData): PredictionResult {
  const periods = userData.periods || [];

  // If no period data is provided, return null predictions
  if (periods.length === 0) {
    return {
      message: "No period data available for predictions.",
      predictions: null,
    };
  }

  // If only one period is available, we can make rough predictions based on averages
  if (periods.length === 1) {
    const defaultCycleLength = 28; // Common average cycle length
    const periodDuration = dayDifference(parseDate(periods[0].start), parseDate(periods[0].end)) + 1;
    
    const lastStart = parseDate(periods[0].start);
    
    const predictedNextPeriodStart = new Date(lastStart);
    predictedNextPeriodStart.setDate(predictedNextPeriodStart.getDate() + defaultCycleLength);
    
    const predictedNextPeriodEnd = new Date(predictedNextPeriodStart);
    predictedNextPeriodEnd.setDate(predictedNextPeriodStart.getDate() + periodDuration - 1);
    
    const estimatedOvulationDate = new Date(predictedNextPeriodStart);
    estimatedOvulationDate.setDate(estimatedOvulationDate.getDate() - 14); // Luteal phase = 14 days
    
    const fertileStart = new Date(estimatedOvulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);
    
    const fertileEnd = new Date(estimatedOvulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);
    
    return {
      message: "Predictions based on limited data (one period).",
      predictions: {
        predictedNextPeriodStart,
        predictedNextPeriodEnd,
        estimatedOvulationDate,
        fertileWindow: { start: fertileStart, end: fertileEnd },
      },
    };
  }

  // 1. Compute cycle stats based on 2+ cycles
  const { avgCycleLength, avgPeriodDuration } = computeCycleStatistics(periods);

  if (!avgCycleLength) {
    return {
      message: "Insufficient period history to compute cycle statistics.",
      predictions: null,
    };
  }

  // 2. Identify last period start
  const lastPeriod = periods[periods.length - 1];
  const lastStart = parseDate(lastPeriod.start);

  // 3. Predict next period start and end
  const predictedNextPeriodStart = new Date(lastStart);
  predictedNextPeriodStart.setDate(predictedNextPeriodStart.getDate() + Math.round(avgCycleLength));

  const periodDur = avgPeriodDuration || 5; // Default period duration is 5 days
  const predictedNextPeriodEnd = new Date(predictedNextPeriodStart);
  predictedNextPeriodEnd.setDate(predictedNextPeriodEnd.getDate() + Math.round(periodDur) - 1);

  // 4. Estimate ovulation date
  const estimatedOvulationDate = new Date(predictedNextPeriodStart);
  estimatedOvulationDate.setDate(estimatedOvulationDate.getDate() - 14); // Luteal phase = 14 days

  // 5. Calculate fertile window
  const fertileStart = new Date(estimatedOvulationDate);
  fertileStart.setDate(fertileStart.getDate() - 5); // Fertile window starts 5 days before ovulation

  const fertileEnd = new Date(estimatedOvulationDate);
  fertileEnd.setDate(fertileEnd.getDate() + 1); // Fertile window ends 1 day after ovulation

  const fertileWindow = { start: fertileStart, end: fertileEnd };

  // 6. Return predictions
  return {
    message: "Predictions computed successfully.",
    predictions: {
      predictedNextPeriodStart,
      predictedNextPeriodEnd,
      estimatedOvulationDate,
      fertileWindow,
    },
  };
}