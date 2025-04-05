import React, { useState, useEffect } from 'react';
import PeriodCalendar from '../components/health/PeriodCalendar';
import SymptomTracker from '../components/health/SymptomTracker';
import SidePanel from '../components/health/SidePanel';
import Button from '../components/common/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHealthStore } from '../store/healthStore';
import { startOfMonth, endOfMonth, isWithinInterval, differenceInDays } from 'date-fns';

/**
 * PageHeader Component
 */
const PageHeader = ({ title, description, onAnalyticsClick, onResourcesClick }) => (
  <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-4 md:p-8 rounded-xl md:rounded-3xl">
    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">{title}</h1>
        <p className="text-secondary-light/90">{description}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
        <Button
          variant="secondary"
          aria-label="Open Analytics Panel"
          onClick={onAnalyticsClick}
          className="w-full sm:w-auto text-sm md:text-base"
        >
          <ChevronLeft size={18} className="mr-1 md:mr-2" />
          Period Analytics
        </Button>
        <Button
          variant="secondary"
          aria-label="Open Resources Panel"
          onClick={onResourcesClick}
          className="w-full sm:w-auto text-sm md:text-base"
        >
          <ChevronRight size={18} className="mr-1 md:mr-2" />
          Resources
        </Button>
      </div>
    </div>
  </div>
);

const Health = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPanel, setShowPanel] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' or 'resources'

  const {
    cycles,
    fetchCycles,
    addCycle,
    removeCycle,
    getPredictions,
    loading,
    error,
  } = useHealthStore();

  useEffect(() => {
    fetchCycles();
  }, [fetchCycles]);

  const predictions = getPredictions();

  // Helper function to remove all cycles in the target month.
  const removeCyclesForMonth = async (targetMonth) => {
    const modalStart = startOfMonth(targetMonth);
    const modalEnd = endOfMonth(targetMonth);
    const cyclesToRemove = cycles.filter((cycle) => {
      const cycleStart = new Date(cycle.startDate);
      const cycleEnd = new Date(cycle.endDate);
      return (
        isWithinInterval(cycleStart, { start: modalStart, end: modalEnd }) ||
        isWithinInterval(cycleEnd, { start: modalStart, end: modalEnd }) ||
        (cycleStart <= modalStart && cycleEnd >= modalEnd)
      );
    });
    for (const cycle of cyclesToRemove) {
      if (cycle.id) await removeCycle(cycle.id);
    }
  };

  // Function to split an array of dates into contiguous segments.
  const splitContiguous = (dates) => {
    if (!dates.length) return [];
    const segments = [];
    let segment = [dates[0]];
    for (let i = 1; i < dates.length; i++) {
      const diff = differenceInDays(dates[i], dates[i - 1]);
      if (diff === 1) {
        segment.push(dates[i]);
      } else {
        segments.push(segment);
        segment = [dates[i]];
      }
    }
    if (segment.length) segments.push(segment);
    return segments;
  };

  /**
   * handleLogPeriod now receives an array of selectedDates and a targetMonth.
   * It:
   * 1. Removes all cycles in the target month.
   * 2. Splits the selected dates into contiguous segments.
   * 3. Adds each segment as a new cycle.
   * If selectedDates is empty, it simply deletes the cycles.
   */
  const handleLogPeriod = async (selectedDates, targetMonth) => {
    try {
      await removeCyclesForMonth(targetMonth);
      if (selectedDates.length === 0) return;
      // Split into contiguous segments.
      const segments = splitContiguous(selectedDates.sort((a, b) => a.getTime() - b.getTime()));
      for (const segment of segments) {
        const startDate = segment[0];
        const endDate = segment[segment.length - 1];
        await addCycle({ startDate, endDate });
      }
    } catch (err) {
      console.error('Error logging period:', err);
    }
  };

  // Side panel controls.
  const openAnalytics = () => {
    setActiveTab('analytics');
    setShowPanel(true);
  };

  const openResources = () => {
    setActiveTab('resources');
    setShowPanel(true);
  };

  const closePanel = () => {
    setShowPanel(false);
  };

  return (
    <div className="space-y-4 md:space-y-8 px-3 sm:px-5 md:px-6">
      <PageHeader
        title="Reproductive Health"
        description="Track and understand your cycle"
        onAnalyticsClick={openAnalytics}
        onResourcesClick={openResources}
      />
      {loading && cycles.length === 0 && (
        <div className="text-center py-4 md:py-8">
          <div className="animate-pulse">Loading your period data...</div>
        </div>
      )}
      {error && (
        <div className="bg-red-50 p-3 md:p-4 rounded-lg text-red-700 mb-3 md:mb-4">
          <p>Error: {error}</p>
          <button className="underline mt-2" onClick={fetchCycles}>
            Try again
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        <div className="md:col-span-1 lg:col-span-2">
          <PeriodCalendar
            cycles={cycles}
            predictions={predictions}
            onLogPeriod={handleLogPeriod}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          {!loading && cycles.length === 0 && (
            <div className="text-center text-gray-500 mt-3 md:mt-4">
              <p>No data yet. Log your first period to get started!</p>
            </div>
          )}
        </div>
        <div>
          <SymptomTracker
            selectedDate={selectedDate}
            onLogSymptom={(symptomData) => {
              console.log('Logging symptom:', symptomData);
            }}
          />
        </div>
      </div>
      <SidePanel
        isOpen={showPanel}
        onClose={closePanel}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        className="fixed inset-0 bg-white z-50 p-4 md:p-6 overflow-auto"
      />
    </div>
  );
};

export default Health;
