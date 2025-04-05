import { useState, useCallback } from 'react';
import { addDays, differenceInDays } from 'date-fns';
import { useHealthStore } from '../store/healthStore';
import { PredictionDetails } from '../types/health';

export function usePeriodTracker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { cycles, addCycle, getPredictions } = useHealthStore();

  // Get predictions using the correct method name
  const predictionData = cycles.length > 0 ? getPredictions() : null;
  const predictions = predictionData?.predictions || null;
  
  // Extract next period date from predictions or use fallback
  const nextPeriodDate = predictions?.predictedNextPeriodStart 
    ? new Date(predictions.predictedNextPeriodStart) 
    : addDays(new Date(), 14);
  
  // Extract fertile window from predictions or use fallback
  const fertileWindow = predictions?.fertileWindow 
    ? {
        start: new Date(predictions.fertileWindow.start),
        end: new Date(predictions.fertileWindow.end)
      }
    : {
        start: addDays(new Date(), 7),
        end: addDays(new Date(), 12)
      };

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleAddPeriod = useCallback((startDate: Date, endDate: Date = addDays(startDate, 5)) => {
    // The addCycle function expects only startDate and endDate
    addCycle({
      startDate,
      endDate
    });
  }, [addCycle]);

  const getMLPrediction = useCallback((date: Date): PredictionDetails => {
    // Calculate prediction based on historical data
    const daysToPeriod = predictions?.predictedNextPeriodStart 
      ? differenceInDays(new Date(predictions.predictedNextPeriodStart), date) 
      : 14;
    
    let predictionType: 'period' | 'ovulation' | 'fertile' | 'safe' = 'safe';
    let probability = 0.8;
    let details = '';
    let recommendations: string[] = [];

    if (daysToPeriod <= 5 && daysToPeriod >= 0) {
      predictionType = 'period';
      probability = 0.95;
      details = "High likelihood of period starting";
      recommendations = [
        "Keep period supplies handy",
        "Stay hydrated",
        "Consider taking pain relief medication if needed"
      ];
    } else if (daysToPeriod >= 12 && daysToPeriod <= 16) {
      predictionType = 'fertile';
      probability = 0.85;
      details = "You're in your fertile window";
      recommendations = [
        "Track any ovulation symptoms",
        "Monitor body temperature",
        "Note any changes in discharge"
      ];
    } else if (daysToPeriod === 14) {
      predictionType = 'ovulation';
      probability = 0.9;
      details = "Ovulation likely today";
      recommendations = [
        "You may experience mild cramping",
        "Track your basal body temperature",
        "Note any changes in cervical mucus"
      ];
    }

    return {
      type: predictionType,
      probability,
      details,
      recommendations
    };
  }, [predictions]);

  return {
    selectedDate,
    nextPeriodDate,
    fertileWindow,
    predictions,
    handleDateSelect,
    handleAddPeriod,
    getMLPrediction
  };
}