import React, { useState, useEffect } from 'react';
import { 
  Activity, Clipboard, Frown, Thermometer, Droplets, Heart, 
  Coffee, Moon, ArrowRight, Save, Zap, Star, AlertCircle,
  Flame, Cloud, Pizza, Clock, Utensils, Squirrel, BatteryCharging
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useHealthStore } from '../../store/healthStore';

interface SymptomTrackerProps {
  selectedDate: Date;
  currentCycleDay: number | null; // Current day of cycle (null if unknown)
  userId: string;
  cycles: any[]; // Your existing cycle data
}

export default function SymptomTracker({ 
  selectedDate, 
  currentCycleDay, 
  userId,
  cycles 
}: SymptomTrackerProps) {
  // Get required methods from health store
  const addSymptom = useHealthStore(state => state.addSymptom);
  const updateSymptom = useHealthStore(state => state.updateSymptom);
  const symptoms = useHealthStore(state => state.symptoms);
  const fetchSymptoms = useHealthStore(state => state.fetchSymptoms);
  const loading = useHealthStore(state => state.symptomLoading);
  const error = useHealthStore(state => state.symptomError);

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [predictedSymptoms, setPredictedSymptoms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [existingLog, setExistingLog] = useState<any>(null);
  const [authStatus, setAuthStatus] = useState<{
    isAuthenticated: boolean;
    user: any;
    error: string | null;
  }>({
    isAuthenticated: false,
    user: null,
    error: null
  });

  // Comprehensive symptom list
  const symptomsList = [
    { id: 'cramps', label: 'Cramps', icon: <Activity size={18} /> },
    { id: 'headache', label: 'Headache', icon: <Frown size={18} /> },
    { id: 'bloating', label: 'Bloating', icon: <Droplets size={18} /> },
    { id: 'fatigue', label: 'Fatigue', icon: <Moon size={18} /> },
    { id: 'mood_swings', label: 'Mood Swings', icon: <Cloud size={18} /> },
    { id: 'breast_tenderness', label: 'Breast Tenderness', icon: <AlertCircle size={18} /> },
    { id: 'backache', label: 'Backache', icon: <Zap size={18} /> },
    { id: 'nausea', label: 'Nausea', icon: <Thermometer size={18} /> },
    { id: 'acne', label: 'Acne', icon: <Flame size={18} /> },
    { id: 'food_cravings', label: 'Food Cravings', icon: <Pizza size={18} /> },
    { id: 'insomnia', label: 'Insomnia', icon: <Clock size={18} /> },
    { id: 'diarrhea', label: 'Diarrhea', icon: <Utensils size={18} /> },
    { id: 'constipation', label: 'Constipation', icon: <Squirrel size={18} /> },
    { id: 'dizziness', label: 'Dizziness', icon: <BatteryCharging size={18} /> },
    { id: 'irritability', label: 'Irritability', icon: <Heart size={18} /> },
    { id: 'anxiety', label: 'Anxiety', icon: <Activity size={18} /> },
    { id: 'depression', label: 'Depression', icon: <Cloud size={18} /> },
    { id: 'hot_flashes', label: 'Hot Flashes', icon: <Flame size={18} /> },
    { id: 'appetite_changes', label: 'Appetite Changes', icon: <Coffee size={18} /> },
    { id: 'spotting', label: 'Spotting', icon: <Droplets size={18} /> }
  ];

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Auth error:', error);
          setAuthStatus({
            isAuthenticated: false,
            user: null,
            error: error.message
          });
          return;
        }
        
        if (user) {
          console.log('Authenticated user:', user.id);
          setAuthStatus({
            isAuthenticated: true,
            user,
            error: null
          });
        } else {
          console.warn('No authenticated user found');
          setAuthStatus({
            isAuthenticated: false,
            user: null,
            error: 'No authenticated user found'
          });
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setAuthStatus({
          isAuthenticated: false,
          user: null,
          error: 'Error checking authentication status'
        });
      }
    };
    
    checkAuth();
  }, []);

  // Fetch symptoms data from store
  useEffect(() => {
    fetchSymptoms();
  }, [fetchSymptoms]);

  // Load existing symptom log for selected date and predicted symptoms
  useEffect(() => {
    const loadSymptomData = async () => {
      setIsLoading(true);
      
      try {
        // Format date to ISO string without time
        const dateString = selectedDate.toISOString().split('T')[0];
        
        // Find symptom log for this date (from store data)
        const existingSymptom = symptoms.find(symp => 
          new Date(symp.date).toISOString().split('T')[0] === dateString
        );
        
        if (existingSymptom) {
          // Existing log found, populate form
          setExistingLog(existingSymptom);
          setSelectedSymptoms(existingSymptom.symptoms || []);
        } else {
          // Reset form for new entry
          setExistingLog(null);
          setSelectedSymptoms([]);
          
          // Only predict symptoms if we don't have an existing log
          if (currentCycleDay !== null) {
            predictSymptoms(currentCycleDay);
          }
        }
      } catch (error) {
        console.error('Error in loadSymptomData:', error);
      }
      
      setIsLoading(false);
    };
    
    // Only load data if we have symptoms from the store
    if (symptoms.length >= 0) {
      loadSymptomData();
    }
  }, [selectedDate, symptoms, currentCycleDay]);

  // Predict symptoms based on historical data for the current cycle day
  const predictSymptoms = (cycleDay: number) => {
    try {
      // Find all past symptoms on the same cycle day
      const cycleSpecificSymptoms = symptoms.filter(
        log => log.cycle_day === cycleDay
      );
      
      if (!cycleSpecificSymptoms || cycleSpecificSymptoms.length === 0) {
        setPredictedSymptoms([]);
        return;
      }
      
      // Count frequency of each symptom
      const symptomCounts: Record<string, number> = {};
      let totalLogs = cycleSpecificSymptoms.length;
      
      cycleSpecificSymptoms.forEach(log => {
        if (log.symptoms && Array.isArray(log.symptoms)) {
          log.symptoms.forEach((symptom: string) => {
            symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
          });
        }
      });
      
      // Calculate which symptoms appear in at least 50% of logs for this cycle day
      const predictions = Object.entries(symptomCounts)
        .filter(([_, count]) => (count / totalLogs) >= 0.5) // Appear in at least 50% of logs
        .map(([symptom, _]) => symptom);
      
      setPredictedSymptoms(predictions);
    } catch (error) {
      console.error('Error in predictSymptoms:', error);
      setPredictedSymptoms([]);
    }
  };

  // Toggle symptom selection
  const handleSymptomToggle = (id: string) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  // Save symptoms using health store
  const handleSave = async () => {
    if (selectedSymptoms.length === 0) return;
    
    try {
      const symptomData = {
        date: selectedDate,
        symptoms: selectedSymptoms,
        intensity: 1, // Default value since we removed the UI
        cycle_day: currentCycleDay || undefined
      };
      
      console.log('Saving symptom data:', symptomData);
      
      let result;
      
      if (existingLog) {
        // Update existing log
        result = await updateSymptom(existingLog.id, symptomData);
      } else {
        // Insert new log
        result = await addSymptom(symptomData);
      }
      
      console.log('Save result:', result);
      
      // Update UI with saved log
      setExistingLog(result);
      
      // Show success message
      alert('Symptoms saved successfully!');
      
    } catch (error) {
      console.error('Error saving symptoms:', error);
      alert(`Failed to save symptoms: ${error.message || 'Unknown error'}`);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Filter recent logs
  const recentLogs = symptoms
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Display auth error if present
  if (authStatus.error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Clipboard className="w-6 h-6 text-red-500" />
          <h2 className="text-lg font-semibold text-red-500">Authentication Error</h2>
        </div>
        <p className="text-red-500">{authStatus.error}</p>
        <p className="mt-4 text-sm">Please make sure you are logged in and refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <Clipboard className="w-6 h-6 text-primary" />
        <h2 className="text-lg font-semibold text-primary">Symptom Tracker</h2>
      </div>
      
     
      {/* Current cycle day info */}
      {currentCycleDay !== null && (
        <div className="bg-primary/10 p-3 rounded-lg">
          <p className="text-sm font-medium text-primary">
            Cycle Day {currentCycleDay} - {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </p>
        </div>
      )}
      
      {/* Predicted symptoms */}
      {predictedSymptoms.length > 0 && !existingLog && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Star className="w-5 h-5 text-yellow-600 mr-2" />
            <h3 className="text-sm font-medium text-yellow-700">Predicted Symptoms</h3>
          </div>
          <p className="text-xs text-yellow-800 mb-2">
            Based on your history, you may experience:
          </p>
          <div className="flex flex-wrap gap-2">
            {predictedSymptoms.map(symptomId => {
              const symptom = symptomsList.find(s => s.id === symptomId);
              return symptom ? (
                <span key={symptomId} className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                  {symptom.icon}
                  <span className="ml-1">{symptom.label}</span>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
      
      {isLoading || loading ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">Loading symptoms...</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Select Symptoms</h3>
            <div className="grid grid-cols-2 gap-2">
              {symptomsList.map(symptom => (
                <button
                  key={symptom.id}
                  onClick={() => handleSymptomToggle(symptom.id)}
                  className={`flex items-center p-2 rounded-lg text-sm ${
                    selectedSymptoms.includes(symptom.id) 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  } ${predictedSymptoms.includes(symptom.id) && !selectedSymptoms.includes(symptom.id) ? 'border-2 border-yellow-300' : ''}`}
                >
                  <span className="mr-2">{symptom.icon}</span>
                  {symptom.label}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleSave}
            disabled={selectedSymptoms.length === 0 || !authStatus.isAuthenticated}
            className={`w-full py-2 rounded-lg font-medium flex items-center justify-center ${
              selectedSymptoms.length > 0 && authStatus.isAuthenticated
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4 mr-2" />
            {existingLog ? 'Update Symptoms' : 'Log Symptoms'}
          </button>
        </>
      )}
      
      {/* Recent logs */}
      {recentLogs.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-700">Recent Logs</h3>
            {symptoms.length > 5 && (
              <a href="#" className="text-xs text-primary">View all</a>
            )}
          </div>
          <div className="space-y-2">
            {recentLogs.map(log => (
              <div key={log.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-700">
                    {formatDate(log.date.toString())}
                    {log.cycle_day !== null && (
                      <span className="ml-2 text-xs text-gray-500">Day {log.cycle_day}</span>
                    )}
                  </p>
                  <div className="flex space-x-1">
                    {log.symptoms.slice(0, 3).map((symptomId: string) => {
                      const symptom = symptomsList.find(s => s.id === symptomId);
                      return symptom ? (
                        <span key={symptomId} className="text-primary">
                          {symptom.icon}
                        </span>
                      ) : null;
                    })}
                    {log.symptoms.length > 3 && (
                      <span className="text-xs text-gray-500 self-center">
                        +{log.symptoms.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {log.cycle_day !== null && <span>Cycle day: {log.cycle_day}</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Insights section */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-700 mb-2">Symptom Insights</h3>
        <p className="text-xs text-blue-600">
          Click on 'Period Analytics' from the header to view insights into your logged symptoms
        </p>
  
      </div>
    </div>
  );
}