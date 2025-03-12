export interface CycleData {
  startDate: Date;
  endDate: Date;
  symptoms?: string[];
  flow?: 'light' | 'medium' | 'heavy';
}

export interface BBTLog {
  date: string;
  temperature: number;
  time: string;
  notes?: string;
}

export interface CervicalMucusLog {
  date: string;
  type: 'dry' | 'sticky' | 'creamy' | 'watery' | 'egg-white';
  notes?: string;
}

export interface LifestyleFactors {
  recentHormonalBCChange?: boolean;
  significantWeightChange?: number;
  highStress?: boolean;
  majorLifestyleChange?: boolean;
  recentIllness?: boolean;
  travelTimeZones?: boolean;
  medicationsAffectingCycle?: boolean;
}

export interface PredictionResult {
  nextPeriodDate: Date;
  fertileWindow: {
    start: Date;
    end: Date;
  };
  ovulationDate: Date;
  confidence: number;
}