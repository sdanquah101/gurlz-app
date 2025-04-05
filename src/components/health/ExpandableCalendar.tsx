import React, { useRef, useEffect, useState } from 'react';
import { format, addDays, isSameDay, isWithinInterval } from 'date-fns';
import { PredictionData } from '../../types/health';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpandableCalendarProps {
  isExpanded: boolean;
  selectedRange: { start: Date | null; end: Date | null };
  onRangeSelect: (start: Date | null, end: Date | null) => void;
  onDateSelect: (date: Date) => void;
  prediction?: PredictionData | null;
}

export default function ExpandableCalendar({
  isExpanded,
  selectedRange,
  onRangeSelect,
  onDateSelect,
  prediction
}: ExpandableCalendarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const days = Array.from({ length: 60 }, (_, i) => addDays(new Date(), i - 30));

  const handleScroll = (e: WheelEvent) => {
    if (scrollRef.current) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.addEventListener('wheel', handleScroll, { passive: false });
      return () => element.removeEventListener('wheel', handleScroll);
    }
  }, []);

  const getDayStyle = (date: Date) => {
    let baseStyle = 'relative transition-all duration-200';
    let contentStyle = 'w-full h-full rounded-full flex items-center justify-center';
    let dotStyle = '';

    if (selectedRange.start && selectedRange.end && 
        isWithinInterval(date, { start: selectedRange.start, end: selectedRange.end })) {
      contentStyle += ' bg-red-100 text-red-600';
      dotStyle = 'bg-red-500';
    } else if (prediction) {
      if (isSameDay(date, prediction.nextPeriodDate)) {
        contentStyle += ' bg-red-50 text-red-600';
        dotStyle = 'bg-red-400';
      } else if (isWithinInterval(date, prediction.fertileWindow)) {
        contentStyle += ' bg-teal-50 text-teal-600';
        dotStyle = 'bg-teal-400';
      } else if (isSameDay(date, prediction.fertileWindow.end)) {
        contentStyle += ' bg-primary text-white';
        dotStyle = 'bg-white';
      }
    }

    return { baseStyle, contentStyle, dotStyle };
  };

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
    if (!isSelecting) {
      setIsSelecting(true);
      onRangeSelect(date, null);
    } else {
      setIsSelecting(false);
      onRangeSelect(selectedRange.start, date);
    }
  };

  return (
    <motion.div 
      layout
      className={`transition-all duration-500 ease-in-out ${isExpanded ? 'h-[500px]' : 'h-[120px]'}`}
    >
      <div
        ref={scrollRef}
        className="h-full overflow-x-auto hide-scrollbar"
      >
        <motion.div 
          layout
          className={`
            grid auto-rows-max transition-all duration-500 ease-in-out
            ${isExpanded ? 'grid-cols-7 gap-4 p-6' : 'flex gap-2 p-4'}
          `}
        >
          <AnimatePresence>
            {days.map((date) => {
              const { baseStyle, contentStyle, dotStyle } = getDayStyle(date);
              return (
                <motion.button
                  layout
                  key={date.toISOString()}
                  className={`${baseStyle} ${isExpanded ? 'w-14 h-14' : 'w-16 flex-none'}`}
                  onClick={() => handleDateClick(date)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={contentStyle}>
                    <div className="flex flex-col items-center">
                      <span className="text-xs opacity-60">{format(date, 'EEE')}</span>
                      <span className="font-medium">{format(date, 'd')}</span>
                      {!isExpanded && (
                        <span className="text-xs opacity-60">{format(date, 'MMM')}</span>
                      )}
                    </div>
                  </div>
                  {dotStyle && (
                    <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${dotStyle}`} />
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}