import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMentalStore } from '../../../store/mentalStore';
import Button from '../../common/Button';
import MoodInput from './MoodInput';
import MoodChart from './MoodChart';
import MoodAnalysis from './MoodAnalysis';

export default function MoodTracker() {
  const navigate = useNavigate();
  const { moodEntries, addMoodEntry } = useMentalStore();
  const [selectedMood, setSelectedMood] = useState();
  const [selectedEnergy, setSelectedEnergy] = useState();
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [note, setNote] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSubmit = () => {
    if (!selectedMood || !selectedEnergy) return;

    addMoodEntry({
      mood: selectedMood,
      energy: selectedEnergy,
      triggers: selectedTriggers,
      note: note.trim(),
      timestamp: new Date(),
    });

    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 2000);

    setSelectedMood(undefined);
    setSelectedEnergy(undefined);
    setSelectedTriggers([]);
    setNote('');
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Toggle Calendar Button */}
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="fixed top-4 right-4 z-30 p-2 sm:p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
        aria-label={showCalendar ? "Close calendar" : "Open calendar"}
      >
        {showCalendar ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        ) : (
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        )}
      </button>

      {/* Sliding Calendar Sidebar */}
      <AnimatePresence>
        {showCalendar && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCalendar(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10 md:hidden"
            />
            
            {/* Calendar Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[90%] md:w-96 bg-white shadow-xl z-20 overflow-y-auto"
            >
              <div className="p-4 mt-16">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Mood Calendar</h2>
                <MoodChart entries={moodEntries} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/mental')}
            className="mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Mental Wellness
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Mood Tracker</h1>
          <p className="text-sm sm:text-base text-secondary-light/90">
            Track and understand your emotional well-being
          </p>
        </div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          <MoodInput
            onMoodSelect={setSelectedMood}
            onEnergySelect={setSelectedEnergy}
            onTriggerSelect={setSelectedTriggers}
            selectedMood={selectedMood}
            selectedEnergy={selectedEnergy}
            selectedTriggers={selectedTriggers}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add a note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none text-sm sm:text-base"
              rows={3}
              placeholder="How are you feeling today?"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!selectedMood || !selectedEnergy}
            className="w-full text-sm sm:text-base"
          >
            Save Entry
          </Button>
        </motion.div>

        {/* Analysis Section */}
        <MoodAnalysis entries={moodEntries} />
      </div>

      {/* Popup Notification */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 sm:top-10 right-4 sm:right-10 bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg z-50 text-sm sm:text-base"
          >
            Mood Entry Submitted
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}