import React, { useRef, useState } from 'react';
import { format, addDays, isSameDay, isWithinInterval } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScrollableCalendarProps {
  startDate: Date;
  daysToShow: number;
  selectedRange: { start: Date | null; end: Date | null };
  onRangeSelect: (start: Date | null, end: Date | null) => void;
  predictions?: {
    period: { start: Date; end: Date };
    fertile: { start: Date; end: Date };
    ovulation: Date;
    safe: { start: Date; end: Date }[];
  };
}

export default function ScrollableCalendar({
  startDate,
  daysToShow,
  selectedRange,
  onRangeSelect,
  predictions
}: ScrollableCalendarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  
  const days = Array.from({ length: daysToShow }, (_, i) => addDays(startDate, i));

  const handleDayClick = (date: Date) => {
    if (!isSelecting) {
      setIsSelecting(true);
      onRangeSelect(date, null);
    } else {
      setIsSelecting(false);
      if (selectedRange.start && date >= selectedRange.start) {
        onRangeSelect(selectedRange.start, date);
      } else {
        onRangeSelect(date, null);
      }
    }
  };

  const handleDayHover = (date: Date) => {
    if (isSelecting && selectedRange.start) {
      onRangeSelect(selectedRange.start, date);
    }
  };

  const getDayColor = (date: Date) => {
    if (selectedRange.start && selectedRange.end && 
        isWithinInterval(date, { start: selectedRange.start, end: selectedRange.end })) {
      return 'bg-red-100 hover:bg-red-200';
    }
    
    if (predictions) {
      if (isWithinInterval(date, predictions.period)) {
        return 'bg-red-50 hover:bg-red-100';
      }
      if (isWithinInterval(date, predictions.fertile)) {
        return 'bg-pink-50 hover:bg-pink-100';
      }
      if (isSameDay(date, predictions.ovulation)) {
        return 'bg-teal-600 text-white hover:bg-teal-700';
      }
      for (const safeRange of predictions.safe) {
        if (isWithinInterval(date, safeRange)) {
          return 'bg-teal-50 hover:bg-teal-100';
        }
      }
    }
    
    return 'hover:bg-gray-100';
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md"
      >
        <ChevronLeft className="w-5 h-5 text-primary" />
      </button>

      <div 
        ref={scrollRef}
        className="overflow-x-auto hide-scrollbar flex space-x-1 px-12"
        style={{ scrollBehavior: 'smooth' }}
      >
        {days.map((date) => (
          <button
            key={date.toISOString()}
            onClick={() => handleDayClick(date)}
            onMouseEnter={() => handleDayHover(date)}
            className={`
              flex-none w-16 py-3 rounded-lg text-center transition-colors
              ${getDayColor(date)}
              ${isSameDay(date, new Date()) ? 'ring-2 ring-primary' : ''}
            `}
          >
            <div className="text-xs text-gray-500">{format(date, 'EEE')}</div>
            <div className="text-lg font-semibold">{format(date, 'd')}</div>
            <div className="text-xs text-gray-500">{format(date, 'MMM')}</div>
          </button>
        ))}
      </div>

      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md"
      >
        <ChevronRight className="w-5 h-5 text-primary" />
      </button>
    </div>
  );
}