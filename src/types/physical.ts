export interface Activity {
  id: string;
  type: string;
  value: number;
  unit: string;
  time?: string;
  notes?: string;
  timestamp: Date;
}

export interface Goal {
  id: string;
  title: string;
  target: string;
  progress: number;
  deadline: string;
}