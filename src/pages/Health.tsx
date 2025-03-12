import React, { useState, useEffect } from 'react';
import PeriodCalendar from '../components/health/PeriodCalendar';
import SymptomTracker from '../components/health/SymptomTracker';
import SidePanel from '../components/health/SidePanel';
import Button from '../components/common/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHealthStore } from '../store/healthStore';

/**
 * PageHeader Component
 */
const PageHeader = ({ title, description, onAnalyticsClick, onResourcesClick }) => (
  <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-secondary-light/90">{description}</p>
      </div>
      <div className="flex space-x-4">
        <Button
          variant="secondary"
          aria-label="Open Analytics Panel"
          onClick={onAnalyticsClick}
        >
          <ChevronLeft size={20} className="mr-2" />
          Period Analytics
        </Button>
        <Button
          variant="secondary"
          aria-label="Open Resources Panel"
          onClick={onResourcesClick}
        >
          <ChevronRight size={20} className="mr-2" />
          Resources
        </Button>
      </div>
    </div>
  </div>
);

const Health: React.FC = () => {
  const [state, setState] = useState({
    selectedDate: new Date(),
    showPanel: false,
    activeTab: 'analytics' as 'analytics' | 'resources',
  });

  // Use Zustand store for cycles and predictions
  const { cycles, fetchCycles, addCycle, removeCycle, getPredictions, loading, error } = useHealthStore();

  // Fetch cycles on component mount
  useEffect(() => {
    fetchCycles();
  }, [fetchCycles]);

  // Get predictions
  const predictions = getPredictions();

  // Function to handle state updates
  const handleStateUpdate = (key: keyof typeof state, value: any) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  // Handle period logging (start and end dates)
  const handleLogPeriod = async (startDate: Date, endDate: Date) => {
    try {
      await addCycle({ startDate, endDate });
    } catch (err) {
      // Error is already handled in the store
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Reproductive Health"
        description="Track and understand your cycle"
        onAnalyticsClick={() => {
          handleStateUpdate('activeTab', 'analytics');
          handleStateUpdate('showPanel', true);
        }}
        onResourcesClick={() => {
          handleStateUpdate('activeTab', 'resources');
          handleStateUpdate('showPanel', true);
        }}
      />

      {/* Loading State */}
      {loading && cycles.length === 0 && (
        <div className="text-center py-8">
          <div className="animate-pulse">Loading your period data...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 p-4 rounded-lg text-red-700 mb-4">
          <p>Error: {error}</p>
          <button 
            className="underline mt-2"
            onClick={() => fetchCycles()}
          >
            Try again
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className={`grid lg:grid-cols-3 gap-8`}>
        {/* Calendar Section */}
        <div className="lg:col-span-2">
          <PeriodCalendar
            cycles={cycles} // Pass cycles from the Zustand store
            predictions={predictions} // Pass predictions to PeriodCalendar
            onLogPeriod={handleLogPeriod} // Pass logging function
            selectedDate={state.selectedDate} // Pass selected date
            setSelectedDate={(date: Date) => handleStateUpdate('selectedDate', date)} // Update selected date
          />
          {!loading && cycles.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              <p>No data yet. Log your first period to get started!</p>
            </div>
          )}
        </div>

        {/* Tracker Section */}
        <div>
          <SymptomTracker 
            selectedDate={state.selectedDate}
            onLogSymptom={(symptomData) => {
              // Implement your symptom logging logic here
              console.log("Logging symptom:", symptomData);
            }}
          />
        </div>
        
      </div>

      {/* Side Panel */}
      <SidePanel
        isOpen={state.showPanel}
        onClose={() => handleStateUpdate('showPanel', false)}
        activeTab={state.activeTab}
        onTabChange={(tab) => handleStateUpdate('activeTab', tab)}
        className="fixed inset-0 bg-white z-50 p-6 overflow-auto"
      />
    </div>
  );
};

export default Health;