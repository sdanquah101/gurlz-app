import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';
import Button from '../../common/Button';

interface AppointmentConfirmationProps {
  therapistName: string;
  date: Date;
  time: string;
  onConfirm: () => void; // Function to handle confirmation
  onCancel: () => void; // Function to handle cancellation
}

export default function AppointmentConfirmation({
  therapistName,
  date,
  time,
  onConfirm,
  onCancel,
}: AppointmentConfirmationProps) {
  if (!therapistName || !date || !time) {
    return <p className="text-red-500">Invalid appointment details.</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold text-primary">Confirm Appointment</h3>
      
      <div className="bg-secondary/10 p-6 rounded-xl space-y-4">
        <div className="flex items-center space-x-3">
          <User className="text-primary" />
          <div>
            <p className="text-sm text-gray-500">Therapist</p>
            <p className="font-medium">{therapistName}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Calendar className="text-primary" />
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{date.toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Clock className="text-primary" />
          <div>
            <p className="text-sm text-gray-500">Time</p>
            <p className="font-medium">{time}</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={onCancel} className="flex-1" aria-label="Cancel Appointment">
          Cancel
        </Button>
        <Button onClick={onConfirm} className="flex-1" aria-label="Confirm Appointment">
          Confirm Booking
        </Button>
      </div>
    </motion.div>
  );
}
