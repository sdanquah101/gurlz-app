import React, { useEffect, useState } from 'react';
import { useHealthStore } from '../../store/healthStore';
import { differenceInDays, format, isWithinInterval, addDays, subDays } from 'date-fns';
import { BarChart2, Calendar, Activity, Droplet, TrendingUp, AlertCircle, Clock, PieChart } from 'lucide-react';

interface AnalyticsViewProps {
  // You can add props if needed
}

// Helper to determine cycle phase
const determineCyclePhase = (date: Date, cycles: any[]) => {
  // Check if date is during a period
  for (const cycle of cycles) {
    const startDate = new Date(cycle.startDate);
    const endDate = new Date(cycle.endDate);
    
    if (isWithinInterval(date, { start: startDate, end: endDate })) {
      return 'menstruation';
    }
  }
  
  // Check if date is during likely ovulation (assume mid-cycle)
  for (let i = 0; i < cycles.length - 1; i++) {
    const currentCycleStart = new Date(cycles[i].startDate);
    const nextCycleStart = new Date(cycles[i + 1].startDate);
    const cycleDuration = differenceInDays(nextCycleStart, currentCycleStart);
    const ovulationStartDate = addDays(currentCycleStart, Math.floor(cycleDuration / 2) - 2);
    const ovulationEndDate = addDays(currentCycleStart, Math.floor(cycleDuration / 2) + 2);
    
    if (isWithinInterval(date, { start: ovulationStartDate, end: ovulationEndDate })) {
      return 'ovulation';
    }
  }
  
  // Check if it's in luteal phase (after ovulation, before period)
  for (let i = 0; i < cycles.length - 1; i++) {
    const currentCycleStart = new Date(cycles[i].startDate);
    const nextCycleStart = new Date(cycles[i + 1].startDate);
    const cycleDuration = differenceInDays(nextCycleStart, currentCycleStart);
    const ovulationDate = addDays(currentCycleStart, Math.floor(cycleDuration / 2));
    const lutealStart = addDays(ovulationDate, 1);
    
    if (isWithinInterval(date, { start: lutealStart, end: subDays(nextCycleStart, 1) })) {
      return 'luteal';
    }
  }
  
  // Check if it's in follicular phase (after period, before ovulation)
  for (let i = 0; i < cycles.length - 1; i++) {
    const currentCycleEndDate = new Date(cycles[i].endDate);
    const nextCycleStart = new Date(cycles[i + 1].startDate);
    const cycleDuration = differenceInDays(nextCycleStart, new Date(cycles[i].startDate));
    const ovulationDate = addDays(new Date(cycles[i].startDate), Math.floor(cycleDuration / 2));
    
    if (isWithinInterval(date, { start: addDays(currentCycleEndDate, 1), end: subDays(ovulationDate, 1) })) {
      return 'follicular';
    }
  }
  
  return 'unknown';
};

const AnalyticsView: React.FC<AnalyticsViewProps> = () => {
  const { cycles, loading, symptoms } = useHealthStore();
  const [symptomAnalysis, setSymptomAnalysis] = useState<any>({
    mostCommon: [],
    byPhase: {},
    correlations: [],
    trends: {}
  });
  
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
  
  // Analyze symptoms
  useEffect(() => {
    if (!symptoms || symptoms.length === 0 || cycles.length < 2) return;
    
    // Count all symptoms
    const symptomCounts = {};
    symptoms.forEach(log => {
      if (log.symptoms && Array.isArray(log.symptoms)) {
        log.symptoms.forEach(symptom => {
          symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
        });
      }
    });
    
    // Find most common symptoms
    const mostCommon = Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ 
        name, 
        count, 
        percentage: Math.round((count / symptoms.length) * 100) 
      }));
    
    // Group symptoms by cycle phase
    const byPhase = {
      menstruation: {},
      follicular: {},
      ovulation: {},
      luteal: {}
    };
    
    const phaseCounters = {
      menstruation: 0,
      follicular: 0,
      ovulation: 0,
      luteal: 0
    };
    
    symptoms.forEach(log => {
      const date = new Date(log.date);
      const phase = determineCyclePhase(date, cycles);
      
      if (phase !== 'unknown') {
        phaseCounters[phase]++;
        
        if (log.symptoms && Array.isArray(log.symptoms)) {
          log.symptoms.forEach(symptom => {
            byPhase[phase][symptom] = (byPhase[phase][symptom] || 0) + 1;
          });
        }
      }
    });
    
    // Calculate percentages for each phase
    Object.keys(byPhase).forEach(phase => {
      const totalInPhase = phaseCounters[phase];
      if (totalInPhase > 0) {
        byPhase[phase] = Object.entries(byPhase[phase])
          .map(([name, count]) => ({ 
            name, 
            count, 
            percentage: Math.round((count as number / totalInPhase) * 100) 
          }))
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 3);
      } else {
        byPhase[phase] = [];
      }
    });
    
    // Find correlations (symptoms that often appear together)
    const correlations = [];
    const symptomPairs = {};
    
    symptoms.forEach(log => {
      if (log.symptoms && log.symptoms.length > 1) {
        for (let i = 0; i < log.symptoms.length; i++) {
          for (let j = i + 1; j < log.symptoms.length; j++) {
            // Create a unique pair key (alphabetical order)
            const pair = [log.symptoms[i], log.symptoms[j]].sort().join('_');
            symptomPairs[pair] = (symptomPairs[pair] || 0) + 1;
          }
        }
      }
    });
    
    Object.entries(symptomPairs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .forEach(([pair, count]) => {
        const [symptom1, symptom2] = pair.split('_');
        correlations.push({ 
          pair: [symptom1, symptom2],
          count,
          percentage: Math.round((count / symptoms.length) * 100)
        });
      });
    
    // Analyze trends over time (last 3 months vs earlier)
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    
    const recentSymptoms = {};
    const olderSymptoms = {};
    
    let recentCount = 0;
    let olderCount = 0;
    
    symptoms.forEach(log => {
      const logDate = new Date(log.date);
      const isRecent = logDate >= threeMonthsAgo;
      
      if (log.symptoms && Array.isArray(log.symptoms)) {
        if (isRecent) {
          recentCount++;
          log.symptoms.forEach(symptom => {
            recentSymptoms[symptom] = (recentSymptoms[symptom] || 0) + 1;
          });
        } else {
          olderCount++;
          log.symptoms.forEach(symptom => {
            olderSymptoms[symptom] = (olderSymptoms[symptom] || 0) + 1;
          });
        }
      }
    });
    
    // Calculate percentage changes
    const trends = {};
    
    if (recentCount > 0 && olderCount > 0) {
      Object.keys({...recentSymptoms, ...olderSymptoms}).forEach(symptom => {
        const recentPerc = recentSymptoms[symptom] ? (recentSymptoms[symptom] / recentCount) * 100 : 0;
        const olderPerc = olderSymptoms[symptom] ? (olderSymptoms[symptom] / olderCount) * 100 : 0;
        
        if (recentPerc > 0 || olderPerc > 0) {
          trends[symptom] = {
            recent: recentPerc,
            older: olderPerc,
            change: recentPerc - olderPerc
          };
        }
      });
    }
    
    // Sort trends by absolute change
    const significantTrends = Object.entries(trends)
      .filter(([_, data]) => Math.abs(data.change) > 5) // Only significant changes
      .sort((a, b) => Math.abs(b[1].change) - Math.abs(a[1].change))
      .slice(0, 3)
      .map(([name, data]) => ({
        name,
        change: data.change,
        increasing: data.change > 0
      }));
    
    setSymptomAnalysis({
      mostCommon,
      byPhase,
      correlations,
      trends: significantTrends
    });
  }, [symptoms, cycles]);
  
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
  
  // Color mapping for cycle phases
  const phaseColors = {
    menstruation: 'bg-red-100 text-red-700',
    follicular: 'bg-green-100 text-green-700',
    ovulation: 'bg-purple-100 text-purple-700',
    luteal: 'bg-yellow-100 text-yellow-700'
  };
  
  // Friendly names for phases
  const phaseNames = {
    menstruation: 'Menstruation',
    follicular: 'Follicular',
    ovulation: 'Ovulation',
    luteal: 'Luteal'
  };
  
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
      
      {/* Symptom Analysis Section */}
      <h2 className="text-xl font-semibold text-primary flex items-center mt-8">
        <Activity size={20} className="mr-2" />
        Symptom Analysis
      </h2>
      
      {symptoms && symptoms.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <p className="text-gray-600">No symptom data recorded yet</p>
          <p className="text-sm text-gray-500 mt-2">Track your symptoms daily for personalized insights</p>
        </div>
      ) : (
        <>
          {/* Most Common Symptoms */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-medium text-gray-700 mb-4 flex items-center">
              <PieChart size={18} className="mr-2" />
              Your Most Common Symptoms
            </h3>
            
            {symptomAnalysis.mostCommon && symptomAnalysis.mostCommon.length > 0 ? (
              <div className="space-y-3">
                {symptomAnalysis.mostCommon.map((symptom, index) => (
                  <div key={index} className="relative">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{symptom.name}</span>
                      <span className="text-gray-500">{symptom.percentage}% of logs</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full"
                        style={{ width: `${symptom.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                <p className="text-sm text-gray-600 mt-3">
                  <strong>Insight:</strong> {symptomAnalysis.mostCommon[0]?.name} is your most frequently logged symptom,
                  appearing in {symptomAnalysis.mostCommon[0]?.percentage}% of your symptom logs.
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Not enough data for analysis yet.</p>
            )}
          </div>
          
          {/* Symptoms by Cycle Phase */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-medium text-gray-700 mb-4 flex items-center">
              <Clock size={18} className="mr-2" />
              Symptoms by Cycle Phase
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(phaseNames).map(phase => (
                <div key={phase} className={`p-3 rounded-lg ${phaseColors[phase].split(' ')[0]} bg-opacity-30`}>
                  <h4 className={`text-sm font-medium ${phaseColors[phase].split(' ')[1]} mb-2`}>
                    {phaseNames[phase]} Phase
                  </h4>
                  
                  {symptomAnalysis.byPhase[phase] && symptomAnalysis.byPhase[phase].length > 0 ? (
                    <ul className="text-xs space-y-1">
                      {symptomAnalysis.byPhase[phase].map((s, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{s.name}</span>
                          <span className="text-gray-600">{s.percentage}%</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500">No data for this phase yet</p>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <p className="font-medium text-blue-700">Pattern Insight:</p>
              {symptomAnalysis.byPhase.menstruation && symptomAnalysis.byPhase.menstruation.length > 0 ? (
                <p>During menstruation, you're most likely to experience {symptomAnalysis.byPhase.menstruation[0]?.name}, 
                   while {symptomAnalysis.byPhase.luteal && symptomAnalysis.byPhase.luteal[0]?.name} is most common in your luteal phase.
                </p>
              ) : (
                <p>Continue tracking to reveal how your symptoms change throughout your cycle phases.</p>
              )}
            </div>
          </div>
          
          {/* Correlated Symptoms */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-medium text-gray-700 mb-3 flex items-center">
              <AlertCircle size={18} className="mr-2" />
              Symptom Combinations
            </h3>
            
            {symptomAnalysis.correlations && symptomAnalysis.correlations.length > 0 ? (
              <>
                <div className="space-y-3">
                  {symptomAnalysis.correlations.map((correlation, idx) => (
                    <div key={idx} className="flex items-center p-2 bg-gray-50 rounded-lg">
                      <div className="bg-primary bg-opacity-10 p-2 rounded-full mr-3">
                        <Activity size={16} className="text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">
                          {correlation.pair[0]} + {correlation.pair[1]}
                        </div>
                        <div className="text-xs text-gray-500">
                          Appear together in {correlation.percentage}% of your logs
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  <strong>Insight:</strong> {symptomAnalysis.correlations[0]?.pair[0]} and {symptomAnalysis.correlations[0]?.pair[1]} frequently occur together. These symptoms may be connected or triggered by the same hormonal changes.
                </p>
              </>
            ) : (
              <p className="text-gray-500 text-sm">Continue tracking multiple symptoms to discover patterns.</p>
            )}
          </div>
          
          {/* Symptom Trends */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-medium text-gray-700 mb-3 flex items-center">
              <TrendingUp size={18} className="mr-2" />
              Changing Symptoms (Last 3 Months)
            </h3>
            
            {symptomAnalysis.trends && symptomAnalysis.trends.length > 0 ? (
              <>
                <div className="space-y-3">
                  {symptomAnalysis.trends.map((trend, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{trend.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        trend.increasing 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {trend.increasing ? '+' : ''}
                        {Math.round(trend.change)}% 
                        {trend.increasing ? 'more frequent' : 'less frequent'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Trend Alert:</strong> {symptomAnalysis.trends[0]?.name} has {symptomAnalysis.trends[0]?.increasing ? 'increased' : 'decreased'} significantly in the last 3 months. {symptomAnalysis.trends[0]?.increasing ? 'You might want to discuss this with your healthcare provider if it continues.' : 'This change could indicate positive hormonal balance or lifestyle improvements.'}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-sm">Continue tracking to reveal how your symptoms change over time.</p>
            )}
          </div>
        </>
      )}
      
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
    </div>
  );
};

export default AnalyticsView;