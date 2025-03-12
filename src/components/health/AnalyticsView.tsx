import React from 'react';
import { useHealthStore } from '../../store/healthStore';
import { differenceInDays, format } from 'date-fns';
import { BarChart2, Calendar, Activity, Droplet } from 'lucide-react';

interface AnalyticsViewProps {
  // You can add props if needed
}

const AnalyticsView: React.FC<AnalyticsViewProps> = () => {
  const { cycles, loading } = useHealthStore();
  
  // Calculate average cycle length
  const calculateAverageCycleLength = () => {
    if (cycles.length < 2) return 0;
    
    const cycleLengths = [];
    for (let i = 0; i < cycles.length - 1; i++) {
      const startDate = new Date(cycles[i].startDate);
      const nextStartDate = new Date(cycles[i + 1].startDate);
      cycleLengths.push(differenceInDays(nextStartDate, startDate));
    }
    
    return cycleLengths.length > 0 
      ? cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length 
      : 0;
  };
  
  // Calculate average period duration
  const calculateAveragePeriodLength = () => {
    if (cycles.length === 0) return 0;
    
    const periodDurations = cycles.map(cycle => {
      const start = new Date(cycle.startDate);
      const end = new Date(cycle.endDate);
      return differenceInDays(end, start) + 1; // +1 because it's inclusive
    });
    
    return periodDurations.length > 0 
      ? periodDurations.reduce((sum, length) => sum + length, 0) / periodDurations.length 
      : 0;
  };
  
  // Calculate cycle regularity (standard deviation)
  const calculateCycleRegularity = () => {
    if (cycles.length < 2) return 0;
    
    const cycleLengths = [];
    for (let i = 0; i < cycles.length - 1; i++) {
      const startDate = new Date(cycles[i].startDate);
      const nextStartDate = new Date(cycles[i + 1].startDate);
      cycleLengths.push(differenceInDays(nextStartDate, startDate));
    }
    
    const mean = cycleLengths.reduce((sum, val) => sum + val, 0) / cycleLengths.length;
    const squaredDiffs = cycleLengths.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / cycleLengths.length;
    
    return Math.sqrt(variance);
  };
  
  const avgCycleLength = calculateAverageCycleLength();
  const avgPeriodLength = calculateAveragePeriodLength();
  const cycleRegularity = calculateCycleRegularity();
  
  if (loading) {
    return <div className="text-center py-4">Loading analytics...</div>;
  }
  
  if (cycles.length < 2) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600">Not enough data for analytics</p>
        <p className="text-sm text-gray-500 mt-2">Log at least two periods to see analytics</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-primary flex items-center">
        <BarChart2 size={20} className="mr-2" />
        Cycle Analysis
      </h2>
      
      {/* Summary Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Average Cycle Length</p>
          <p className="text-3xl font-bold text-primary">{avgCycleLength.toFixed(1)} days</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Average Period Length</p>
          <p className="text-3xl font-bold text-secondary-dark">{avgPeriodLength.toFixed(1)} days</p>
        </div>
      </div>
      
      {/* Cycle Regularity */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-medium text-gray-700 mb-2">Cycle Regularity</h3>
        <div className="mb-2">
          <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                cycleRegularity < 2 ? 'bg-green-500' :
                cycleRegularity < 4 ? 'bg-green-400' :
                cycleRegularity < 6 ? 'bg-yellow-400' :
                'bg-red-400'
              }`}
              style={{ width: `${Math.min(100, 100 - (cycleRegularity * 8))}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {cycleRegularity < 2 ? 'Very Regular' :
             cycleRegularity < 4 ? 'Regular' :
             cycleRegularity < 6 ? 'Somewhat Regular' :
             'Irregular'}
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Your cycles vary by about {cycleRegularity.toFixed(1)} days on average.
        </p>
      </div>
      
      {/* Cycle History */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-medium text-gray-700 mb-4 flex items-center">
          <Calendar size={18} className="mr-2" />
          Period History
        </h3>
        <div className="space-y-3">
          {[...cycles].reverse().map((cycle, index) => (
            <div key={cycle.id || index} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-secondary-dark flex items-center justify-center mr-3">
                <Droplet size={16} className="text-primary-dark" />
              </div>
              <div>
                <div className="font-medium text-gray-700">
                  {format(new Date(cycle.startDate), 'MMMM d')} - {format(new Date(cycle.endDate), 'MMMM d, yyyy')}
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <span className="mr-3">{cycle.length || differenceInDays(new Date(cycle.endDate), new Date(cycle.startDate)) + 1} days</span>
                  {index < cycles.length - 1 && (
                    <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
                      {differenceInDays(
                        new Date(cycles[cycles.length - index - 1].startDate),
                        new Date(cycles[cycles.length - index - 2].startDate)
                      )}-day cycle
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Common Symptoms */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-medium text-gray-700 mb-3 flex items-center">
          <Activity size={18} className="mr-2" />
          Common Symptoms
        </h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-secondary bg-opacity-20 text-xs rounded-full text-primary-dark">Cramps</span>
          <span className="px-3 py-1 bg-secondary bg-opacity-20 text-xs rounded-full text-primary-dark">Bloating</span>
          <span className="px-3 py-1 bg-secondary bg-opacity-20 text-xs rounded-full text-primary-dark">Headache</span>
          <span className="px-3 py-1 bg-secondary bg-opacity-20 text-xs rounded-full text-primary-dark">Fatigue</span>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Note: For more detailed symptom tracking, use the daily log feature.
        </p>
      </div>
    </div>
  );
};

export default AnalyticsView;