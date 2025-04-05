import React from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns';

interface AppointmentCalendarProps {
  selectedDate: Date; // Currently selected date
  onDateSelect: (date: Date) => void; // Function to handle date selection
  availableSlots: Record<string, string[]>; // Available slots for each date
}

export default function AppointmentCalendar({
  selectedDate,
  onDateSelect,
  availableSlots,
}: AppointmentCalendarProps) {
  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const hasAnySlots = weekDays.some(
    (date) => availableSlots[format(date, 'yyyy-MM-dd')]?.length > 0
  );

  return (
    <div className="space-y-4">
      {!hasAnySlots && (
        <p className="text-center text-gray-500">
          No available slots for this week.
        </p>
      )}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const hasSlots = availableSlots[dateStr]?.length > 0;

          return (
            <motion.button
              key={dateStr}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => hasSlots && onDateSelect(date)}
              aria-label={`${
                hasSlots ? `Select date: ${format(date, 'EEEE, MMMM d')}` : ''
              }`}
              disabled={!hasSlots}
              className={`p-4 rounded-xl text-center transition-colors relative
                ${isSameDay(date, selectedDate) ? 'bg-primary text-white' : ''}
                ${
                  hasSlots
                    ? 'hover:bg-primary/10 focus:ring-2 focus:ring-primary'
                    : 'opacity-50 cursor-not-allowed'
                }
                ${isToday(date) ? 'ring-2 ring-primary' : ''}
              `}
            >
              <div className="text-xs mb-1">{format(date, 'EEE')}</div>
              <div className="text-lg font-semibold">{format(date, 'd')}</div>
              {hasSlots && (
                <div className="text-xs mt-1">
                  {availableSlots[dateStr].length} slots
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
