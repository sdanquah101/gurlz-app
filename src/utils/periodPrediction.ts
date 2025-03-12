import { addDays, differenceInDays } from 'date-fns';

interface Cycle {
  startDate: Date;
  endDate: Date;
  length: number;
}

interface PredictionResult {
  nextPeriodDate: Date;
  fertileWindow: {
    start: Date;
    end: Date;
  };
  ovulationDate: Date;
  confidence: number;
}

export function predictNextPeriod(previousCycles: Cycle[]): PredictionResult {
  if (previousCycles.length < 3) {
    throw new Error('Need at least 3 cycles for prediction');
  }

  // Get last 3 cycles
  const recentCycles = previousCycles.slice(-3);
  
  // Calculate weighted average cycle length
  const weights = [0.5, 0.3, 0.2]; // More recent cycles have higher weight
  const averageCycleLength = Math.round(
    recentCycles.reduce((acc, cycle, i) => acc + cycle.length * weights[i], 0)
  );

  // Calculate variance to determine prediction confidence
  const variance = recentCycles.reduce((acc, cycle) => {
    return acc + Math.pow(cycle.length - averageCycleLength, 2);
  }, 0) / 3;
  
  const confidence = Math.max(0, Math.min(100, 100 - (variance * 2)));

  // Calculate next period date
  const lastPeriodStart = new Date(recentCycles[recentCycles.length - 1].startDate);
  const nextPeriodDate = addDays(lastPeriodStart, averageCycleLength);

  // Calculate ovulation (typically 14 days before next period)
  const ovulationDate = addDays(nextPeriodDate, -14);

  // Calculate fertile window (typically 5 days before and 1 day after ovulation)
  const fertileWindow = {
    start: addDays(ovulationDate, -5),
    end: addDays(ovulationDate, 1)
  };

  return {
    nextPeriodDate,
    fertileWindow,
    ovulationDate,
    confidence
  };
}