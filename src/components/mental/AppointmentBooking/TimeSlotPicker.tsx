import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface TimeSlotPickerProps {
  slots: string[]; // Array of available time slots
  selectedSlot: string | null; // Currently selected slot
  onSlotSelect: (slot: string) => void; // Function to handle slot selection
}

export default function TimeSlotPicker({
  slots,
  selectedSlot,
  onSlotSelect
}: TimeSlotPickerProps) {
  return (
    <div className="space-y-4">
      {slots.length === 0 ? (
        <p className="text-center text-gray-500">No time slots available.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {slots.map((slot) => (
            <motion.button
              key={slot}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSlotSelect(slot)}
              aria-pressed={selectedSlot === slot} // Accessibility
              className={`p-3 rounded-lg text-center transition-colors
                ${selectedSlot === slot
                  ? 'bg-primary text-white'
                  : 'bg-gray-50 hover:bg-gray-100'
                }`}
            >
              {format(new Date(`2000-01-01 ${slot}`), 'h:mm a')}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
