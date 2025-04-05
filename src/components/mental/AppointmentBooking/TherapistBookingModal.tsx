import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { X, Calendar, Clock, FileText } from 'lucide-react';
import Button from '../../common/Button';
import AppointmentCalendar from './AppointmentCalendar';
import TimeSlotPicker from './TimeSlotPicker';
import SituationForm from './SituationForm';

interface TherapistBookingModalProps {
  therapist: {
    id: string;
    name: string;
    specialty: string;
    image: string;
  };
  onClose: () => void;
  onBook: (data: {
    date: Date;
    time: string;
    situation: string;
  }) => void;
  availableSlots: Record<string, string[]>;
}

export default function TherapistBookingModal({
  therapist,
  onClose,
  onBook,
  availableSlots
}: TherapistBookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [situation, setSituation] = useState('');

  const handleSubmit = async () => {
    try {
      // Insert appointment into Supabase
      const { error } = await supabase.from('appointments').insert({
        therapist_id: therapist.id,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        situation,
        status: 'pending'
      });

      if (error) {
        console.error('Error booking appointment:', error);
        return;
      }

      // Call the onBook callback to notify parent component
      onBook({
        date: selectedDate,
        time: selectedTime,
        situation
      });
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-xl p-6 max-w-lg w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={therapist.image}
              alt={therapist.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{therapist.name}</h3>
              <p className="text-sm text-gray-500">{therapist.specialty}</p>
            </div>
          </div>
          <button onClick={onClose}>
            <X size={24} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Steps */}
        <div className="flex justify-between items-center mb-6">
          {['Date', 'Time', 'Details'].map((stepName, index) => (
            <div
              key={stepName}
              className={`flex items-center ${
                index < 2 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${step > index + 1 ? 'bg-primary text-white' : 
                    step === index + 1 ? 'bg-primary text-white' : 
                    'bg-gray-100 text-gray-400'}`}
              >
                {index + 1}
              </div>
              {index < 2 && (
                <div className={`flex-1 h-1 mx-2 ${
                  step > index + 1 ? 'bg-primary' : 'bg-gray-100'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center text-gray-700 mb-4">
                <Calendar className="mr-2" size={20} />
                <span>Select Date</span>
              </div>
              <AppointmentCalendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                availableSlots={availableSlots}
              />
              <Button 
                onClick={() => setStep(2)}
                disabled={!selectedDate}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center text-gray-700 mb-4">
                <Clock className="mr-2" size={20} />
                <span>Select Time</span>
              </div>
              <TimeSlotPicker
                slots={availableSlots[selectedDate.toISOString().split('T')[0]] || []}
                selectedSlot={selectedTime}
                onSlotSelect={setSelectedTime}
              />
              <div className="flex space-x-4">
                <Button 
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  disabled={!selectedTime}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center text-gray-700 mb-4">
                <FileText className="mr-2" size={20} />
                <span>Describe Your Situation</span>
              </div>
              <SituationForm
                value={situation}
                onChange={setSituation}
              />
              <div className="flex space-x-4">
                <Button 
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!situation.trim()}
                  className="flex-1"
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
