import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Calendar,
  Moon,
  Sun,
  Star,
  Droplet,
  Plus,
  CheckCircle,
  Circle,
} from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isToday,
  getDay,
  add,
  differenceInDays,
} from 'date-fns';

// A modal with enhanced glassmorphism styling
const Modal = ({ isOpen, onClose, children }) => {
  return (
    <div
      className={`fixed inset-0 bg-teal-900/40 backdrop-blur-md flex items-center justify-center z-50 px-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      onClick={onClose}
    >
      <div
        className={`bg-white/90 backdrop-blur-sm rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl border border-white/20 transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
          boxShadow: '0 10px 25px -5px rgba(0, 128, 128, 0.2), 0 10px 10px -5px rgba(0, 128, 128, 0.1)'
        }}
      >
        {children}
      </div>
    </div>
  );
};

const AnimatedButton = ({ children, onClick, className = '', disabled = false }) => (
  <button
    onClick={disabled ? undefined : onClick}
    className={`${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
      } transition-all duration-200`}
    style={{
      transform: disabled ? 'none' : undefined,
    }}
  >
    {children}
  </button>
);

const PeriodCalendar = ({
  cycles,
  predictions,
  onLogPeriod,
  selectedDate,
  setSelectedDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [modalMonth, setModalMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedDates, setTempSelectedDates] = useState([]);
  const [dayInfoModal, setDayInfoModal] = useState({
    isOpen: false,
    day: null,
    info: '',
    position: { x: 0, y: 0 },
  });
  const [activeTab, setActiveTab] = useState('calendar');

  // Weekdays starting with Sunday
  const weekDays = [
    { key: 'sun', label: 'S' },
    { key: 'mon', label: 'M' },
    { key: 'tue', label: 'T' },
    { key: 'wed', label: 'W' },
    { key: 'thu', label: 'T' },
    { key: 'fri', label: 'F' },
    { key: 'sat', label: 'S' },
  ];

  const shouldShowPredictions = () => {
    return cycles.length > 0 && predictions && predictions.predictions;
  };

  // Populate tempSelectedDates from existing cycles whenever modal opens
  useEffect(() => {
    if (isModalOpen) {
      const allCycleDays = [];
      cycles.forEach((cycle) => {
        const start = new Date(cycle.startDate);
        const end = new Date(cycle.endDate);
        eachDayOfInterval({ start, end }).forEach((d) => {
          allCycleDays.push(d);
        });
      });
      setTempSelectedDates(allCycleDays);
    }
  }, [isModalOpen, cycles]);

  // Utility: see if a date is in any logged period
  const isDateInPeriod = (date) => {
    return cycles.some((cycle) =>
      isWithinInterval(date, {
        start: new Date(cycle.startDate),
        end: new Date(cycle.endDate),
      })
    );
  };

  // Determine date "status" for styling
  const getDateStatus = (date) => {
    if (isDateInPeriod(date)) {
      return 'period';
    }
    if (shouldShowPredictions()) {
      const {
        predictedNextPeriodStart,
        predictedNextPeriodEnd,
        estimatedOvulationDate,
        fertileWindow,
      } = predictions.predictions;

      // predicted period
      if (
        predictedNextPeriodStart &&
        predictedNextPeriodEnd &&
        isWithinInterval(date, {
          start: new Date(predictedNextPeriodStart),
          end: new Date(predictedNextPeriodEnd),
        })
      ) {
        return 'predicted-period';
      }
      // ovulation
      if (
        estimatedOvulationDate &&
        isSameDay(date, new Date(estimatedOvulationDate))
      ) {
        return 'ovulation';
      }
      // fertile window
      if (
        fertileWindow &&
        isWithinInterval(date, {
          start: new Date(fertileWindow.start),
          end: new Date(fertileWindow.end),
        })
      ) {
        return 'fertile';
      }
    }
    return 'regular';
  };

  // Build array of days for the monthly calendar
  const getDaysInMonth = (date) => {
    const firstDay = startOfMonth(date);
    const lastDay = endOfMonth(date);
    const firstDayOfWeek = getDay(firstDay);

    const daysWithOffset = [];
    // offset from the previous month
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysWithOffset.push(add(firstDay, { days: -firstDayOfWeek + i }));
    }
    // days in current month
    const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
    daysWithOffset.push(...daysInMonth);

    // fill to 42 cells (6 rows * 7 columns)
    const totalDaysToShow = 42;
    const needed = totalDaysToShow - daysWithOffset.length;
    for (let i = 1; i <= needed; i++) {
      daysWithOffset.push(add(lastDay, { days: i }));
    }
    return daysWithOffset;
  };

  // Toggle date selection in modal
  const isDateSelected = (date) =>
    tempSelectedDates.some((selectedDay) => isSameDay(selectedDay, date));


  const toggleDateSelection = (date) => {
    const alreadySelected = isDateSelected(date);
    if (alreadySelected) {
      setTempSelectedDates(tempSelectedDates.filter((d) => !isSameDay(d, date)));
    } else {
      // If no days selected, auto-select 5 consecutive days
      if (tempSelectedDates.length === 0) {
        const fiveDays = [];
        for (let i = 0; i < 5; i++) {
          fiveDays.push(add(date, { days: i }));
        }
        setTempSelectedDates([...tempSelectedDates, ...fiveDays]);
      } else {
        setTempSelectedDates([...tempSelectedDates, date]);
      }
    }
  };

  // Saving period in modal
  const handleSavePeriod = () => {
    if (tempSelectedDates.length === 0) {
      const confirmClear = window.confirm(
        'No days selected. This will remove any existing period data for this month. Proceed?'
      );
      if (!confirmClear) return;
    }
    // Sort the dates in case they're not in order
    const sortedDates = tempSelectedDates.sort((a, b) => a.getTime() - b.getTime());
    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];
    onLogPeriod(startDate, endDate);
    setIsModalOpen(false);
  };


  // Logic for timeline (phase, etc.)
  const getCurrentCycleInfo = () => {
    if (
      !shouldShowPredictions() ||
      !predictions.predictions.predictedNextPeriodStart
    ) {
      return {
        currentDay: 1,
        cycleLength: 28,
        periodLength: 5,
        phase: 'unknown',
        phaseDay: 1,
      };
    }

    const today = new Date();
    const nextPeriod = new Date(predictions.predictions.predictedNextPeriodStart);
    const lastCycle = cycles[cycles.length - 1];

    if (!lastCycle) {
      return {
        currentDay: 1,
        cycleLength: 28,
        periodLength: 5,
        phase: 'unknown',
        phaseDay: 1,
      };
    }

    const lastPeriodEnd = new Date(lastCycle.endDate);
    const cycleLength =
      differenceInDays(nextPeriod, lastPeriodEnd) + lastCycle.length;
    const daysSinceLastPeriod = differenceInDays(today, lastPeriodEnd);

    let phase = 'unknown';
    let phaseDay = 1;

    if (isDateInPeriod(today)) {
      phase = 'menstrual';
      const currentPeriod = cycles.find((cycle) =>
        isWithinInterval(today, {
          start: new Date(cycle.startDate),
          end: new Date(cycle.endDate),
        })
      );
      if (currentPeriod) {
        phaseDay = differenceInDays(today, new Date(currentPeriod.startDate)) + 1;
      }
    } else if (
      predictions.predictions.estimatedOvulationDate &&
      isSameDay(today, new Date(predictions.predictions.estimatedOvulationDate))
    ) {
      phase = 'ovulation';
      phaseDay = 1;
    } else if (
      predictions.predictions.fertileWindow &&
      isWithinInterval(today, {
        start: new Date(predictions.predictions.fertileWindow.start),
        end: new Date(predictions.predictions.fertileWindow.end),
      })
    ) {
      phase = 'fertile';
      phaseDay =
        differenceInDays(today, new Date(predictions.predictions.fertileWindow.start)) +
        1;
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
      phaseDay,
    };
  };

  const cycleInfo = getCurrentCycleInfo();

  // Icons for timeline phases
  const getPhaseIcon = (phase) => {
    switch (phase) {
      case 'menstrual':
        return <Droplet size={18} className="text-pink-600" />;
      case 'follicular':
        return <Moon size={18} className="text-teal-700" />;
      case 'ovulation':
        return <Star size={18} className="text-yellow-500" />;
      case 'fertile':
        return <Moon size={18} className="text-purple-500" />;
      case 'luteal':
        return <Sun size={18} className="text-orange-400" />;
      default:
        return <Calendar size={18} className="text-teal-500" />;
    }
  };

  const getPhaseName = (phase) => {
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

  const getPhaseDescription = (phase) => {
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

  // Additional styling for each day in the main calendar
  const getDayClass = (day, status) => {
    const isSelectedInMain = isSameDay(day, selectedDate);
    const inCurrentMonth = isSameMonth(day, currentMonth);
    const today = isToday(day);

    let base =
      'relative flex flex-col items-center justify-center rounded-full transition-all duration-200';
    let size = 'w-10 h-10 sm:w-11 sm:h-11';
    let text = today ? 'font-bold text-sm' : 'font-medium text-sm';
    let fade = inCurrentMonth ? '' : 'opacity-40';

    let statusClass =
      'hover:bg-teal-100 text-teal-900 transform hover:scale-105 ease-out';
    switch (status) {
      case 'period':
        statusClass = 'bg-gradient-to-br from-pink-500 to-pink-400 text-white shadow-md';
        break;
      case 'predicted-period':
        statusClass =
          'bg-gradient-to-br from-secondary-dark to-secondary-dark text-white shadow-sm';
        break;
      case 'ovulation':
        statusClass =
          'bg-gradient-to-r from-yellow-400 to-yellow-300 text-yellow-900 shadow-sm';
        break;
      case 'fertile':
        statusClass =
          'bg-gradient-to-r from-purple-400 to-purple-300 text-purple-900 shadow-sm';
        break;
      default:
        // default teal text
        break;
    }

    const ring = isSelectedInMain ? 'ring-2 ring-teal-500 ring-offset-1' : '';

    return `${base} ${size} ${text} ${fade} ${statusClass} ${ring}`;
  };



  // Build arrays for main & modal calendars
  const days = getDaysInMonth(currentMonth);
  const modalDays = getDaysInMonth(modalMonth);

  return (
    <>
      {/* Main container with glassy teal styling */}
      <div className="bg-gradient-to-br from-teal-50 to-teal-100 backdrop-blur-md border border-teal-200  shadow-lg overflow-hidden">
        {/* Header with glassy teal styling */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-4 md:p-8 md:rounded-t-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Your Period Tracker</h2>
            <div className="flex space-x-1">
              <AnimatedButton
                onClick={() => setActiveTab('calendar')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${activeTab === 'calendar'
                  ? 'bg-teal-600/50 text-white hover:bg-teal-600/70'
                  : 'text-white shadow-md'
                  }`}
              >
                Calendar
              </AnimatedButton>
              <AnimatedButton
                onClick={() => setActiveTab('timeline')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${activeTab === 'timeline'
                  ? 'bg-teal-600/50 text-white hover:bg-teal-600/70'
                  : 'text-white shadow-md'
                  }`}
              >
                Timeline
              </AnimatedButton>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <AnimatedButton
                onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
                className="p-1 rounded-full hover:bg-white/20 text-white"
              >
                <ChevronLeft size={20} />
              </AnimatedButton>
              <h3 className="text-xl font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              <AnimatedButton
                onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
                className="p-1 rounded-full hover:bg-white/20 text-white"
              >
                <ChevronRight size={20} />
              </AnimatedButton>
            </div>

            <AnimatedButton
              onClick={() => {
                setModalMonth(currentMonth);
                setIsModalOpen(true);
              }}
              className="bg-[#FEACC6] text-black font-medium px-3 py-1.5 rounded-full text-sm flex items-center shadow-md transition-all"
            >
              <Plus size={16} className="mr-1" />
              Log Period
            </AnimatedButton>
          </div>
        </div>

        {/* Main content with glassy styling */}
        <div className="p-4 bg-white/60 backdrop-blur-sm">
          {activeTab === 'calendar' ? (
            <>
              {/* Weekdays */}
              <div className="grid grid-cols-7 mb-4">
                {weekDays.map((day) => (
                  <div
                    key={day.key}
                    className="text-center text-xs font-semibold text-teal-700"
                  >
                    {day.label}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {days.map((day, idx) => {
                  const status = getDateStatus(day);
                  const dayClass = getDayClass(day, status);

                  return (
                    <AnimatedButton
                      key={idx}
                      onClick={(e) => {
                        setSelectedDate(day);
                        if (isSameMonth(day, currentMonth)) {
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

              {/* Legend */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <div className="flex items-center bg-teal-600/20 px-3 py-1 rounded-full space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                  <span className="text-xs text-teal-800 font-medium">Period</span>
                </div>
                {shouldShowPredictions() && (
                  <>
                    <div className="flex items-center bg-teal-400/20 px-3 py-1 rounded-full space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-secondary-dark"></div>
                      <span className="text-xs text-teal-800 font-medium">Predicted</span>
                    </div>
                    <div className="flex items-center bg-yellow-300/20 px-3 py-1 rounded-full space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <span className="text-xs text-yellow-800 font-medium">Ovulation</span>
                    </div>
                    <div className="flex items-center bg-purple-300/20 px-3 py-1 rounded-full space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                      <span className="text-xs text-purple-800 font-medium">Fertile</span>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            // Timeline tab with glassy teal styling
            <div className="py-3">
              <div className="p-4 rounded-2xl mb-6 border border-teal-200 bg-white/80 backdrop-blur-sm shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-teal-100 shadow-sm">
                    {getPhaseIcon(cycleInfo.phase)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-teal-800">
                      {getPhaseName(cycleInfo.phase)}
                    </h3>
                    <p className="text-sm mt-1 text-teal-700">
                      {getPhaseDescription(cycleInfo.phase)}
                    </p>
                    <div className="mt-2 text-xs font-medium text-teal-600">
                      Day {cycleInfo.phaseDay} of phase • Day {cycleInfo.currentDay} of{' '}
                      {cycleInfo.cycleLength}-day cycle
                    </div>
                  </div>
                </div>
              </div>

              {/* Cycle timeline progress bar with enhanced styling */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-teal-700 mb-2">Cycle Timeline</h3>
                <div className="relative h-5 bg-teal-50 rounded-full overflow-hidden shadow-inner border border-teal-200">
                  {/* Period portion */}
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-300 to-pink-100"
                    style={{
                      width: `${(cycleInfo.periodLength / cycleInfo.cycleLength) * 100
                        }%`,
                    }}
                  />
                  {/* Follicular portion (~9 days) */}
                  <div
                    className="absolute inset-y-0 bg-gradient-to-r from-teal-800 to-teal-600"
                    style={{
                      left: `${(cycleInfo.periodLength / cycleInfo.cycleLength) * 100
                        }%`,
                      width: `${(9 / cycleInfo.cycleLength) * 100}%`,
                    }}
                  />
                  {/* Ovulation (1 day) */}
                  <div
                    className="absolute inset-y-0 bg-gradient-to-r from-yellow-400 to-yellow-300"
                    style={{
                      left: `${((cycleInfo.periodLength + 9) / cycleInfo.cycleLength) * 100
                        }%`,
                      width: `${(1 / cycleInfo.cycleLength) * 100}%`,
                    }}
                  />
                  {/* Luteal portion */}
                  <div
                    className="absolute inset-y-0 right-0 bg-gradient-to-l from-orange-300 to-orange-100"
                    style={{
                      width: `${((cycleInfo.cycleLength -
                        cycleInfo.periodLength -
                        10) /
                        cycleInfo.cycleLength) *
                        100
                        }%`,
                    }}
                  />
                  {/* Current day indicator */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-teal-500 shadow-md"
                    style={{
                      left: `${((cycleInfo.currentDay - 1) / cycleInfo.cycleLength) * 100
                        }%`,
                      marginLeft: '-0.6rem',
                    }}
                  />
                </div>

                <div className="flex justify-between mt-1 text-xs font-medium text-teal-600">
                  <span>Day 1</span>
                  <span>Day {Math.round(cycleInfo.cycleLength / 2)}</span>
                  <span>Day {cycleInfo.cycleLength}</span>
                </div>
              </div>

              {/* Upcoming events with enhanced styling */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-teal-700">Upcoming Events</h3>

                {shouldShowPredictions() &&
                  predictions.predictions.predictedNextPeriodStart && (
                    <div className="flex items-center p-3 bg-pink-600/15 rounded-xl backdrop-blur-sm border border-pink-200/50 shadow-sm">
                      <div className="p-2 rounded-full bg-pink-600/20 mr-3">
                        <Droplet size={18} className="text-pink-700" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-pink-700">Next Period</h4>
                        <p className="text-xs text-pink-600">
                          {format(
                            new Date(predictions.predictions.predictedNextPeriodStart),
                            'MMMM d'
                          )}{' '}
                          -{' '}
                          {format(
                            new Date(predictions.predictions.predictedNextPeriodEnd),
                            'MMMM d'
                          )}
                          {' • '}
                          {differenceInDays(
                            new Date(predictions.predictions.predictedNextPeriodStart),
                            new Date()
                          )}{' '}
                          days away
                        </p>
                      </div>
                    </div>
                  )}

                {shouldShowPredictions() &&
                  predictions.predictions.estimatedOvulationDate && (
                    <div className="flex items-center p-3 bg-yellow-100/60 rounded-xl backdrop-blur-sm border border-yellow-200/50 shadow-sm">
                      <div className="p-2 rounded-full bg-yellow-200 mr-3">
                        <Star size={18} className="text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-yellow-700">Ovulation Day</h4>
                        <p className="text-xs text-yellow-600">
                          {format(
                            new Date(predictions.predictions.estimatedOvulationDate),
                            'MMMM d'
                          )}
                          {' • '}
                          {differenceInDays(
                            new Date(predictions.predictions.estimatedOvulationDate),
                            new Date()
                          )}{' '}
                          days away
                        </p>
                      </div>
                    </div>
                  )}

                {shouldShowPredictions() && predictions.predictions.fertileWindow && (
                  <div className="flex items-center p-3 bg-purple-100/60 rounded-xl backdrop-blur-sm border border-purple-200/50 shadow-sm">
                    <div className="p-2 rounded-full bg-purple-200 mr-3">
                      <Moon size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-purple-700">Fertile Window</h4>
                      <p className="text-xs text-purple-600">
                        {format(
                          new Date(predictions.predictions.fertileWindow.start),
                          'MMMM d'
                        )}{' '}
                        -{' '}
                        {format(
                          new Date(predictions.predictions.fertileWindow.end),
                          'MMMM d'
                        )}
                        {' • '}
                        {differenceInDays(
                          new Date(predictions.predictions.fertileWindow.start),
                          new Date()
                        )}{' '}
                        days away
                      </p>
                    </div>
                  </div>
                )}

                {!shouldShowPredictions() && (
                  <div className="flex items-center p-3 bg-gray-100/60 rounded-xl backdrop-blur-sm border border-gray-200/50 shadow-sm">
                    <div className="p-2 rounded-full bg-gray-200 mr-3">
                      <AlertCircle size={18} className="text-gray-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Need More Data</h4>
                      <p className="text-xs text-gray-600">
                        Log your period regularly to see predictions and insights.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Day info tooltip */}
      {dayInfoModal.isOpen && (
        <div
          className="fixed bg-white rounded-lg shadow-lg p-3 z-40 max-w-xs"
          style={{
            left: `${dayInfoModal.position.x}px`,
            top: `${dayInfoModal.position.y + 30}px`,
            transform: 'translateX(-50%)',
          }}
          onClick={() => setDayInfoModal({ ...dayInfoModal, isOpen: false })}
        >
          <div
            dangerouslySetInnerHTML={{ __html: dayInfoModal.info }}
            className="text-teal-900"
          />
        </div>
      )}

      {/* Period logging modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-teal-800 mb-1">Log Your Period</h3>
          <p className="text-sm text-teal-600">
            Select the days when your period occurred
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <AnimatedButton
              onClick={() => setModalMonth((m) => subMonths(m, 1))}
              className="p-1 rounded-full hover:bg-teal-100 text-teal-700"
            >
              <ChevronLeft size={20} />
            </AnimatedButton>
            <h4 className="text-lg font-medium text-teal-800">
              {format(modalMonth, 'MMMM yyyy')}
            </h4>
            <AnimatedButton
              onClick={() => setModalMonth((m) => addMonths(m, 1))}
              className="p-1 rounded-full hover:bg-teal-100 text-teal-700"
            >
              <ChevronRight size={20} />
            </AnimatedButton>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {weekDays.map((day) => (
              <div
                key={day.key}
                className="text-center text-xs font-semibold text-teal-700"
              >
                {day.label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {modalDays.map((day, idx) => {
              const isSelected = isDateSelected(day);
              const inCurrentMonth = isSameMonth(day, modalMonth);
              const today = isToday(day);

              let className = `
                flex items-center justify-center w-9 h-9 rounded-full 
                ${today ? 'font-bold' : 'font-medium'} 
                ${!inCurrentMonth ? 'opacity-40' : ''} 
                ${isSelected
                  ? 'bg-pink-400 text-white shadow-md'
                  : 'hover:bg-teal-100 text-teal-800'
                }
                transition-all duration-200 cursor-pointer
              `;

              return (
                <div
                  key={idx}
                  className={className}
                  onClick={() => inCurrentMonth && toggleDateSelection(day)}
                >
                  {isSelected ? <CheckCircle size={16} /> : day.getDate()}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex text-sm font-medium">
          <AnimatedButton
            onClick={() => setIsModalOpen(false)}
            className="flex-1 py-2 text-teal-800 hover:bg-teal-50 rounded-lg mr-2"
          >
            Cancel
          </AnimatedButton>
          <AnimatedButton
            onClick={handleSavePeriod}
            className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-md"
          >
            Save
          </AnimatedButton>
        </div>
      </Modal>
    </>
  );
};

export default PeriodCalendar;