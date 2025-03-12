import React, { useEffect, useState } from 'react';
import { 
  ChevronLeft, ChevronRight, AlertCircle, Calendar, 
  Moon, Sun, Star, Droplet, Heart, Plus
} from 'lucide-react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, 
  isToday, getDay, add, differenceInDays
} from 'date-fns';

// Modal component with improved animation
const Modal = ({ isOpen, onClose, children }) => {
  return (
    <div 
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div 
        className={`bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl dark:shadow-primary/20 transition-all duration-200 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={e => e.stopPropagation()}
        style={{ transform: isOpen ? 'translateY(0)' : 'translateY(20px)' }}
      >
        {children}
      </div>
    </div>
  );
};

// Improved animated button with better transitions
const AnimatedButton = ({ children, onClick, className = '', disabled = false }) => (
  <button
    onClick={disabled ? undefined : onClick}
    className={`${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} transition-transform duration-200`}
    style={{
      transform: disabled ? 'none' : undefined
    }}
  >
    {children}
  </button>
);

interface PeriodCalendarProps {
  cycles: any[];
  predictions: any;
  onLogPeriod: (startDate: Date, endDate: Date) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const PeriodCalendar: React.FC<PeriodCalendarProps> = ({ 
  cycles, 
  predictions, 
  onLogPeriod, 
  selectedDate, 
  setSelectedDate 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [modalMonth, setModalMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedDates, setTempSelectedDates] = useState<Date[]>([]);
  const [dayInfoModal, setDayInfoModal] = useState({
    isOpen: false,
    day: null,
    info: '',
    position: { x: 0, y: 0 }
  });
  const [directionAnimate, setDirectionAnimate] = useState<1 | -1>(1); // 1 for forward, -1 for backward
  const [activeTab, setActiveTab] = useState<'calendar' | 'timeline'>('calendar');
  
  // Weekdays starting with Sunday
  const weekDays = [
    { key: 'sun', label: 'S' },
    { key: 'mon', label: 'M' },
    { key: 'tue', label: 'T' },
    { key: 'wed', label: 'W' },
    { key: 'thu', label: 'T' },
    { key: 'fri', label: 'F' },
    { key: 'sat', label: 'S' }
  ];

  // Check if we should show predictions (require valid predictions AND at least one cycle)
  const shouldShowPredictions = () => {
    return cycles.length > 0 && predictions && predictions.predictions;
  };

  // Reset temp selections when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTempSelectedDates([]);
    }
  }, [isModalOpen]);
  
  // Calculate the current cycle day and phase details for the timeline view
  const getCurrentCycleInfo = () => {
    if (!shouldShowPredictions() || !predictions.predictions.predictedNextPeriodStart) {
      return { currentDay: 1, cycleLength: 28, periodLength: 5, phase: 'unknown', phaseDay: 1 };
    }
    
    const today = new Date();
    const nextPeriod = new Date(predictions.predictions.predictedNextPeriodStart);
    const lastCycle = cycles[cycles.length - 1];
    const lastPeriodEnd = new Date(lastCycle.endDate);
    const cycleLength = differenceInDays(nextPeriod, lastPeriodEnd) + lastCycle.length;
    const daysSinceLastPeriod = differenceInDays(today, lastPeriodEnd);
    
    let phase = 'unknown';
    let phaseDay = 1;
    
    // Determine phase
    if (isDateInPeriod(today)) {
      phase = 'menstrual';
      // Find which day of period this is
      const currentPeriod = cycles.find(cycle => 
        isWithinInterval(today, { 
          start: new Date(cycle.startDate), 
          end: new Date(cycle.endDate) 
        })
      );
      if (currentPeriod) {
        phaseDay = differenceInDays(today, new Date(currentPeriod.startDate)) + 1;
      }
    } else if (predictions.predictions.estimatedOvulationDate && 
        isSameDay(today, new Date(predictions.predictions.estimatedOvulationDate))) {
      phase = 'ovulation';
      phaseDay = 1;
    } else if (predictions.predictions.fertileWindow && 
        isWithinInterval(today, { 
          start: new Date(predictions.predictions.fertileWindow.start), 
          end: new Date(predictions.predictions.fertileWindow.end) 
        })) {
      phase = 'fertile';
      phaseDay = differenceInDays(today, new Date(predictions.predictions.fertileWindow.start)) + 1;
    } else if (daysSinceLastPeriod > 0 && daysSinceLastPeriod < 14) {
      phase = 'follicular';
      phaseDay = daysSinceLastPeriod;
    } else {
      phase = 'luteal';
      const daysUntilNextPeriod = differenceInDays(nextPeriod, today);
      phaseDay = 14 - daysUntilNextPeriod;
      if (phaseDay < 1) phaseDay = 1;
    }
    
    return { 
      currentDay: cycleLength - differenceInDays(nextPeriod, today), 
      cycleLength, 
      periodLength: lastCycle.length,
      phase,
      phaseDay
    };
  };

  const getDaysInMonth = (date: Date): Date[] => {
    // First day of the month
    const firstDay = startOfMonth(date);
    // Last day of the month
    const lastDay = endOfMonth(date);
    
    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = getDay(firstDay);
    
    // Create array of days starting from the correct offset for the first week
    const daysWithOffset = [];
    
    // Add days from previous month to fill the first week
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevDate = add(firstDay, { days: -firstDayOfWeek + i });
      daysWithOffset.push(prevDate);
    }
    
    // Add all days of the current month
    const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
    daysWithOffset.push(...daysInMonth);
    
    // Add days from next month to complete the grid
    const totalDaysToShow = 42; // 6 rows x 7 days
    const nextMonthDays = totalDaysToShow - daysWithOffset.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      const nextDate = add(lastDay, { days: i });
      daysWithOffset.push(nextDate);
    }
    
    return daysWithOffset;
  };

  // Improved date comparison for selection
  const isDateSelected = (date: Date, selectedDates: Date[]) => {
    return selectedDates.some(selectedDate => 
      date.getDate() === selectedDate.getDate() && 
      date.getMonth() === selectedDate.getMonth() && 
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Check if date has an existing period logged
  const isDateInPeriod = (date: Date) => {
    return cycles.some(cycle => 
      isWithinInterval(date, { 
        start: new Date(cycle.startDate), 
        end: new Date(cycle.endDate) 
      })
    );
  };

  const toggleDateSelection = (date: Date) => {
    if (isDateSelected(date, tempSelectedDates)) {
      // Remove the date
      const newSelection = tempSelectedDates.filter(d => !isSameDay(d, date));
      setTempSelectedDates(newSelection);
    } else {
      // Add the date
      setTempSelectedDates([...tempSelectedDates, date]);
    }
  };

  const isCurrentMonth = (date: Date): boolean => date.getMonth() === currentMonth.getMonth();

  const isCurrentModalMonth = (date: Date): boolean => date.getMonth() === modalMonth.getMonth();

  const getDateStatus = (date: Date): string => {
    // First check if this is in a logged period
    for (const cycle of cycles) {
      const startDate = new Date(cycle.startDate);
      const endDate = new Date(cycle.endDate);
      
      if (isWithinInterval(date, { start: startDate, end: endDate })) {
        return 'period';
      }
    }
    
    // Only check predictions if we have valid data
    if (shouldShowPredictions()) {
      const {
        predictedNextPeriodStart,
        predictedNextPeriodEnd,
        estimatedOvulationDate,
        fertileWindow,
      } = predictions.predictions;

      if (
        predictedNextPeriodStart &&
        predictedNextPeriodEnd &&
        isWithinInterval(date, { 
          start: new Date(predictedNextPeriodStart), 
          end: new Date(predictedNextPeriodEnd) 
        })
      ) {
        return 'predicted-period';
      }

      if (estimatedOvulationDate && isSameDay(date, new Date(estimatedOvulationDate))) {
        return 'ovulation';
      }

      if (
        fertileWindow &&
        isWithinInterval(date, { 
          start: new Date(fertileWindow.start), 
          end: new Date(fertileWindow.end) 
        })
      ) {
        return 'fertile';
      }
    }

    // Default status
    return 'regular';
  };

  const handleSavePeriod = () => {
    if (tempSelectedDates.length === 0) {
      alert('Please select at least one day for your period.');
      return;
    }
    
    // Sort the selected dates
    const sortedDates = [...tempSelectedDates].sort((a, b) => a.getTime() - b.getTime());
    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];
    
    // Call the parent component's function
    onLogPeriod(startDate, endDate);
    setIsModalOpen(false);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setDirectionAnimate(direction === 'next' ? 1 : -1);
    setCurrentMonth(direction === 'next' ? addMonths(currentMonth, 1) : subMonths(currentMonth, 1));
  };

  const handleModalMonthChange = (direction: 'prev' | 'next') => {
    setModalMonth(direction === 'next' ? addMonths(modalMonth, 1) : subMonths(modalMonth, 1));
  };

 
  
  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'menstrual':
        return <Droplet size={18} className="text-secondary-dark" />;
      case 'follicular':
        return <Moon size={18} className="text-primary-light" />;
      case 'ovulation':
        return <Star size={18} className="text-yellow-500" />;
      case 'fertile':
        return <Moon size={18} className="text-purple-500" />;
      case 'luteal':
        return <Sun size={18} className="text-orange-500" />;
      default:
        return <Calendar size={18} className="text-white" />;
    }
  };

  const getPhaseName = (phase: string) => {
    switch (phase) {
      case 'menstrual':
        return 'Menstrual Phase';
      case 'follicular':
        return 'Follicular Phase';
      case 'ovulation':
        return 'Ovulation';
      case 'fertile':
        return 'Fertile Window';
      case 'luteal':
        return 'Luteal Phase';
      default:
        return 'Tracking Phase';
    }
  };

  const getPhaseDescription = (phase: string) => {
    switch (phase) {
      case 'menstrual':
        return 'Your period is active. Take care of yourself with extra rest and self-care.';
      case 'follicular':
        return 'Your energy is increasing as estrogen rises. Great time for new projects.';
      case 'ovulation':
        return 'Peak fertility day. Your energy and mood are typically at their highest.';
      case 'fertile':
        return 'Higher chance of conception during this window.';
      case 'luteal':
        return 'Progesterone rises. You may experience PMS symptoms in the later part.';
      default:
        return 'Track your cycle to get personalized insights.';
    }
  };

  // Improved day class with better contrast and readability
  const getDayClass = (day: Date, status: string) => {
    const isSelected = isSameDay(day, selectedDate);
    const isCurrentMonthDay = isCurrentMonth(day);
    const isTodayDate = isToday(day);
    
    // Base styles for day button
    let baseClass = "relative flex flex-col items-center justify-center rounded-full transition-all duration-300";
    
    // Adjust size based on screen
    let sizeClass = "w-10 h-10 sm:w-11 sm:h-11";
    
    // Text styles - improved readability
    let textClass = isTodayDate ? "font-bold text-sm" : "font-medium text-sm";
    
    // Current month vs other month opacity
    let opacityClass = isCurrentMonthDay ? "" : "opacity-40";
    
    // Status-specific styling with improved contrast
    let statusClass;
    switch (status) {
      case 'period':
        statusClass = "bg-gradient-to-br from-secondary-dark to-secondary-dark text-white";
        break;
      case 'predicted-period':
        statusClass = "bg-secondary text-primary-dark";
        break;
      case 'ovulation':
        statusClass = "bg-gradient-to-r from-yellow-300 to-yellow-200 text-yellow-900";
        break;
      case 'fertile':
        statusClass = "bg-gradient-to-r from-purple-300 to-purple-200 text-purple-900";
        break;
      default:
        statusClass = "hover:bg-primary-light hover:bg-opacity-20 text-white";
    }
    
    // Selection ring with improved visibility
    let selectionClass = isSelected ? "ring-2 ring-primary ring-offset-1" : "";
    
    return `${baseClass} ${sizeClass} ${textClass} ${opacityClass} ${statusClass} ${selectionClass}`;
  };

  // Improved modal day class with better contrast
  const getModalDayClass = (day: Date) => {
    // First check if it's currently selected in the temp selection
    const isSelected = isDateSelected(day, tempSelectedDates);
    
    // Then check existing periods and other statuses (to mirror main calendar)
    const status = getDateStatus(day);
    const isMonthDay = isCurrentModalMonth(day);
    const isTodayDate = isToday(day);
    
    // Base styles
    let baseClass = "relative flex items-center justify-center rounded-full transition-all duration-300";
    let sizeClass = "w-9 h-9";
    let textClass = isTodayDate ? "font-bold text-sm" : "font-medium text-sm";
    
    // Base styles for days outside current month
    if (!isMonthDay) {
      return `${baseClass} ${sizeClass} text-gray-400 opacity-40 text-sm`;
    }
    
    // Style for selected days (takes precedence)
    if (isSelected) {
      return `${baseClass} ${sizeClass} ${textClass} bg-gradient-to-r from-primary to-primary-light text-white shadow-sm cursor-pointer`;
    }
    
    // Style based on status (mirroring main calendar) with better contrast
    switch (status) {
      case 'period':
        return `${baseClass} ${sizeClass} ${textClass} bg-gradient-to-br from-secondary-dark to-secondary text-white cursor-pointer hover:shadow-sm`;
      case 'predicted-period':
        return `${baseClass} ${sizeClass} ${textClass} bg-secondary bg-opacity-40 text-primary-dark cursor-pointer hover:shadow-sm`;
      case 'ovulation':
        return `${baseClass} ${sizeClass} ${textClass} bg-gradient-to-r from-yellow-300 to-yellow-200 text-black-900 cursor-pointer hover:shadow-sm`;
      case 'fertile':
        return `${baseClass} ${sizeClass} ${textClass} bg-gradient-to-r from-purple-300 to-purple-200 text-purple-900 cursor-pointer hover:shadow-sm`;
      default:
        return `${baseClass} ${sizeClass} ${textClass} hover:bg-gray-100 text-white cursor-pointer`;
    }
  };

  const showDayInfo = (day: Date, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const status = getDateStatus(day);
    
    let info = `<div class="font-medium mb-2 text-white">${format(day, 'MMMM d, yyyy')}</div>`;
    
    // Add info based on the status
    switch (status) {
      case 'period':
        info += '<div class="mb-2 text-secondary-dark font-medium">Period Day</div>';
        info += '<div class="text-sm text-gray-700">Track your flow and symptoms regularly.</div>';
        break;
      case 'predicted-period':
        info += '<div class="mb-2 text-secondary-dark font-medium">Predicted Period</div>';
        info += '<div class="text-sm text-gray-700">Be prepared with supplies and self-care.</div>';
        break;
      case 'ovulation':
        info += '<div class="mb-2 text-yellow-600 font-medium">Ovulation Day</div>';
        info += '<div class="text-sm text-gray-700">Peak fertility. Energy and mood are typically high.</div>';
        break;
      case 'fertile':
        info += '<div class="mb-2 text-purple-600 font-medium">Fertile Window</div>';
        info += '<div class="text-sm text-gray-700">Higher chance of conception during this time.</div>';
        break;
      default:
        if (shouldShowPredictions() && predictions.predictions.predictedNextPeriodStart) {
          const daysUntil = differenceInDays(
            new Date(predictions.predictions.predictedNextPeriodStart), 
            day
          );
          if (daysUntil > 0) {
            info += `<div class="text-sm text-primary-dark font-medium">${daysUntil} days until next period</div>`;
          }
          info += '<div class="text-sm text-gray-700 mt-1">Track your symptoms to improve predictions.</div>';
        } else {
          info += '<div class="text-sm text-primary-dark">Log your period to see predictions and insights.</div>';
        }
    }
    
    setDayInfoModal({
      isOpen: true,
      day,
      info,
      position: { x: rect.left + rect.width / 2, y: rect.top }
    });
  };
  
  const cycleInfo = getCurrentCycleInfo();
  const days = getDaysInMonth(currentMonth);
  const modalDays = getDaysInMonth(modalMonth);

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
        {/* Calendar Header with Tabs */}
        <div className="bg-gradient-to-r from-primary-dark to-primary p-4 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Your Period Tracker</h2>
            <div className="flex space-x-1">
              <AnimatedButton
                onClick={() => setActiveTab('calendar')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${activeTab === 'calendar' ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}
              >
                Calendar
              </AnimatedButton>
              <AnimatedButton
                onClick={() => setActiveTab('timeline')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${activeTab === 'timeline' ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}
              >
                Timeline
              </AnimatedButton>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <AnimatedButton
                onClick={() => handleMonthChange('prev')}
                className="p-1 rounded-full hover:bg-white/10"
              >
                <ChevronLeft size={20} />
              </AnimatedButton>
              <h3 className="text-xl font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              <AnimatedButton
                onClick={() => handleMonthChange('next')}
                className="p-1 rounded-full hover:bg-white/10"
              >
                <ChevronRight size={20} />
              </AnimatedButton>
            </div>
            
            <AnimatedButton
              onClick={() => {
                setModalMonth(currentMonth);
                setIsModalOpen(true);
              }}
              className="bg-secondary-dark hover:bg-opacity-90 text-primary-dark font-medium px-3 py-1.5 rounded-full text-sm flex items-center shadow-sm"
            >
              <Plus size={16} className="mr-1" />
              Log Period
            </AnimatedButton>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-4">
          {activeTab === 'calendar' ? (
            <>
              {/* Weekdays Header */}
              <div className="grid grid-cols-7 mb-4">
                {weekDays.map((day) => (
                  <div key={day.key} className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400">
                    {day.label}
                  </div>
                ))}
              </div>

              {/* Calendar Grid with simplified animation */}
              <div 
                className="grid grid-cols-7 gap-1.5 relative transition-opacity duration-200"
                style={{
                  opacity: 1,
                  transform: `translateX(0)`,
                  transition: 'transform 250ms ease, opacity 250ms ease'
                }}
              >
                {days.map((day, index) => {
                  const status = getDateStatus(day);
                  const dayClass = getDayClass(day, status);
                  

                  return (
                    <AnimatedButton
                      key={`day-${index}`}
                      onClick={(e) => {
                        setSelectedDate(day);
                        if (isCurrentMonth(day)) {
                          showDayInfo(day, e);
                        }
                      }}
                      className={dayClass}
                    >
                      <span>{day.getDate()}</span>
                    
                    </AnimatedButton>
                  );
                })}
              </div>

              {/* Legend - Redesigned as Pills with better contrast */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <div className="flex items-center bg-secondary-dark bg-opacity-20 px-3 py-1 rounded-full space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-secondary-dark"></div>
                  <span className="text-xs text-gray-800 dark:text-gray-200 font-medium">Period</span>
                </div>
                {shouldShowPredictions() && (
                  <>
                    <div className="flex items-center bg-secondary bg-opacity-20 px-3 py-1 rounded-full space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-secondary"></div>
                      <span className="text-xs text-gray-800 dark:text-gray-200 font-medium">Predicted</span>
                    </div>
                    <div className="flex items-center bg-yellow-200 bg-opacity-60 px-3 py-1 rounded-full space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <span className="text-xs text-gray-800 dark:text-gray-200 font-medium">Ovulation</span>
                    </div>
                    <div className="flex items-center bg-purple-200 bg-opacity-60 px-3 py-1 rounded-full space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                      <span className="text-xs text-gray-800 dark:text-gray-200 font-medium">Fertile</span>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            // Timeline View with improved readability
            <div className="py-3">
              {/* Phase Indicator Card */}
              <div className="bg-gradient-to-br from-primary-light/20 to-primary/10 p-4 rounded-2xl mb-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    {getPhaseIcon(cycleInfo.phase)}
                  </div>
                  <div>
                    <h3 className="font-bold text-primary-dark text-base">{getPhaseName(cycleInfo.phase)}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{getPhaseDescription(cycleInfo.phase)}</p>
                    <div className="mt-2 text-xs text-primary-dark font-medium">
                      Day {cycleInfo.phaseDay} of phase • Day {cycleInfo.currentDay} of {cycleInfo.cycleLength}-day cycle
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Cycle Progress Visualization - improved contrast */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Cycle Timeline</h3>
                <div className="relative h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  {/* Period Phase */}
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-secondary-dark to-secondary"
                    style={{ width: `${(cycleInfo.periodLength / cycleInfo.cycleLength) * 100}%` }}
                  ></div>
                  
                  {/* Follicular Phase */}
                  <div 
                    className="absolute inset-y-0 bg-gradient-to-r from-primary-light/50 to-primary-light/70"
                    style={{ 
                      left: `${(cycleInfo.periodLength / cycleInfo.cycleLength) * 100}%`,
                      width: `${(9 / cycleInfo.cycleLength) * 100}%` 
                    }}
                  ></div>
                  
                  {/* Ovulation Phase */}
                  <div 
                    className="absolute inset-y-0 bg-gradient-to-r from-yellow-300 to-yellow-400"
                    style={{ 
                      left: `${((cycleInfo.periodLength + 9) / cycleInfo.cycleLength) * 100}%`,
                      width: `${(1 / cycleInfo.cycleLength) * 100}%` 
                    }}
                  ></div>
                  
                  {/* Luteal Phase */}
                  <div 
                    className="absolute inset-y-0 right-0 bg-gradient-to-l from-orange-300 to-orange-200"
                    style={{ 
                      width: `${((cycleInfo.cycleLength - cycleInfo.periodLength - 10) / cycleInfo.cycleLength) * 100}%` 
                    }}
                  ></div>
                  
                  {/* Current Day Indicator - improved visibility */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-primary shadow-md"
                    style={{ 
                      left: `${((cycleInfo.currentDay - 1) / cycleInfo.cycleLength) * 100}%`,
                      marginLeft: "-0.6rem" 
                    }}
                  ></div>
                </div>
                
                {/* Day Labels - improved readability */}
                <div className="flex justify-between mt-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                  <span>Day 1</span>
                  <span>Day {Math.round(cycleInfo.cycleLength / 2)}</span>
                  <span>Day {cycleInfo.cycleLength}</span>
                </div>
              </div>
              
              {/* Upcoming Events - improved contrast */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Upcoming Events</h3>
                
                {shouldShowPredictions() && predictions.predictions.predictedNextPeriodStart && (
                  <div className="flex items-center p-3 bg-secondary-dark/15 rounded-xl">
                    <div className="p-2 rounded-full bg-secondary-dark/30 mr-3">
                      <Droplet size={18} className="text-secondary-dark" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Next Period</h4>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        {format(new Date(predictions.predictions.predictedNextPeriodStart), 'MMMM d')} - 
                        {' '}{format(new Date(predictions.predictions.predictedNextPeriodEnd), 'MMMM d')}
                        {' • '}{differenceInDays(new Date(predictions.predictions.predictedNextPeriodStart), new Date())} days away
                      </p>
                    </div>
                  </div>
                )}
                
                {shouldShowPredictions() && predictions.predictions.estimatedOvulationDate && (
                  <div className="flex items-center p-3 bg-yellow-100/60 dark:bg-yellow-900/30 rounded-xl">
                    <div className="p-2 rounded-full bg-yellow-200 dark:bg-yellow-700 mr-3">
                      <Star size={18} className="text-yellow-600 dark:text-yellow-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Ovulation Day</h4>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        {format(new Date(predictions.predictions.estimatedOvulationDate), 'MMMM d')}
                        {' • '}{differenceInDays(new Date(predictions.predictions.estimatedOvulationDate), new Date())} days away
                      </p>
                    </div>
                  </div>
                )}
                
                {shouldShowPredictions() && predictions.predictions.fertileWindow && (
                  <div className="flex items-center p-3 bg-purple-100/60 dark:bg-purple-900/30 rounded-xl">
                    <div className="p-2 rounded-full bg-purple-200 dark:bg-purple-700 mr-3">
                      <Moon size={18} className="text-purple-600 dark:text-purple-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Fertile Window</h4>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        {format(new Date(predictions.predictions.fertileWindow.start), 'MMMM d')} - 
                        {' '}{format(new Date(predictions.predictions.fertileWindow.end), 'MMMM d')}
                      </p>
                    </div>
                  </div>
                )}
                
                {!shouldShowPredictions() && (
                  <div className="flex items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 mr-3">
                      <Calendar size={18} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">No Data Yet</h4>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        Log your first period to see predictions
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Day Info Popup - improved visibility */}
      {dayInfoModal.isOpen && (
        <div 
          className="fixed z-50 bg-white dark:bg-white-800 rounded-lg shadow-lg p-3 w-64 border border-gray-200 dark:border-gray-700"
          style={{ 
            top: `${dayInfoModal.position.y + 10}px`,
            left: `${dayInfoModal.position.x - 128}px`, // Center on the day
            opacity: 1,
            transform: 'translateY(0)',
            transition: 'opacity 200ms ease, transform 200ms ease'
          }}
        >
          <div 
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: dayInfoModal.info }}
          />
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white dark:border-b-gray-800"></div>
          <div className="text-right mt-2">
            <button 
              onClick={() => setDayInfoModal({...dayInfoModal, isOpen: false})}
              className="text-xs text-primary font-medium px-2 py-1 rounded hover:bg-primary-light/10"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Log Period Modal - improved readability */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-2">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-white dark:text-white-light">Log Your Period</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Select the days of your menstrual cycle
            </p>
          </div>
          
          {/* Note about the calendar appearance */}
          <div className="mb-4 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl flex items-start">
            <AlertCircle size={18} className="text-primary dark:text-primary-light mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-xs text-white-700 dark:text-gray-300">
              The calendar shows your existing periods and cycle predictions. 
              Selected days are highlighted in blue.
            </div>
          </div>
          
          <div className="mb-4 flex items-center justify-between">
            <AnimatedButton
              onClick={() => handleModalMonthChange('prev')}
              className="p-2 text-primary hover:bg-primary-light/10 rounded-full"
            >
              <ChevronLeft size={20} />
            </AnimatedButton>
            <h4 className="text-lg font-semibold text-primary-dark dark:text-primary-light">
              {format(modalMonth, 'MMMM yyyy')}
            </h4>
            <AnimatedButton
              onClick={() => handleModalMonthChange('next')}
              className="p-2 text-primary hover:bg-primary-light/10 rounded-full"
            >
              <ChevronRight size={20} />
            </AnimatedButton>
          </div>
          
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map((day) => (
              <div
                key={day.key}
                className="text-center text-xs font-medium text-gray-600 dark:text-gray-300"
              >
                {day.label}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-4">
            {modalDays.map((day, index) => {
              const dayClass = getModalDayClass(day);
              const isMonthDay = isCurrentModalMonth(day);
              
              return (
                <AnimatedButton
                  key={`modal-day-${index}`}
                  onClick={() => isMonthDay && toggleDateSelection(day)}
                  className={dayClass}
                  disabled={!isMonthDay}
                >
                  <span>{day.getDate()}</span>
                </AnimatedButton>
              );
            })}
          </div>

          {/* Selected dates summary */}
          {tempSelectedDates.length > 0 && (
            <div 
              className="mt-4 p-3 bg-gradient-to-r from-secondary/20 to-secondary-dark/20 rounded-xl"
            >
              <p className="text-sm text-gray-800 dark:text-gray-200">
                <span className="font-medium">Selected: </span>
                {tempSelectedDates
                  .sort((a, b) => a.getTime() - b.getTime())
                  .map(date => format(date, 'MMM d'))
                  .join(', ')}
                
                {tempSelectedDates.length > 1 && (
                  <span className="ml-1 text-gray-600 dark:text-gray-400">
                    ({tempSelectedDates.length} days)
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Legend for modal - improved contrast */}
          <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Legend</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-xs text-gray-800 dark:text-gray-200">Selected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-secondary-dark"></div>
                <span className="text-xs text-gray-800 dark:text-gray-200">Existing Period</span>
              </div>
              {shouldShowPredictions() && (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <span className="text-xs text-black-800 dark:text-gray-200">Ovulation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                    <span className="text-xs text-black-800 dark:text-gray-200">Fertile Window</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <AnimatedButton
              onClick={() => {
                setIsModalOpen(false);
                setTempSelectedDates([]);
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              onClick={handleSavePeriod}
              disabled={tempSelectedDates.length === 0}
              className={`px-4 py-2 rounded-full text-sm font-medium 
                ${tempSelectedDates.length > 0 
                  ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-sm hover:shadow' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'}
              `}
            >
              Save Period
            </AnimatedButton>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PeriodCalendar;