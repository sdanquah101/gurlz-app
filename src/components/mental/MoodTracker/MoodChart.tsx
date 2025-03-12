import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isToday } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { 
  Sun, Moon, Cloud, CloudRain, Wind,
  Heart, SmilePlus, Frown, Angry, Sparkles, X, ChevronLeft, 
  ChevronRight, Loader2
} from 'lucide-react';

const moods = [
  { 
    value: 'happy', 
    label: 'Happy', 
    icon: (props) => <SmilePlus {...props} />, 
    color: 'bg-gradient-to-br from-green-200 to-green-300',
    borderColor: 'border-green-400'
  },
  { 
    value: 'neutral', 
    label: 'Neutral', 
    icon: (props) => <Moon {...props} />, 
    color: 'bg-gradient-to-br from-yellow-200 to-yellow-300',
    borderColor: 'border-yellow-400'
  },
  { 
    value: 'sad', 
    label: 'Sad', 
    icon: (props) => <Frown {...props} />, 
    color: 'bg-gradient-to-br from-blue-200 to-blue-300',
    borderColor: 'border-blue-400'
  },
  { 
    value: 'anxious', 
    label: 'Anxious', 
    icon: (props) => <Wind {...props} />, 
    color: 'bg-gradient-to-br from-orange-200 to-orange-300',
    borderColor: 'border-orange-400'
  },
  { 
    value: 'angry', 
    label: 'Angry', 
    icon: (props) => <Angry {...props} />, 
    color: 'bg-gradient-to-br from-red-200 to-red-300',
    borderColor: 'border-red-400'
  },
  { 
    value: 'excited', 
    label: 'Excited', 
    icon: (props) => <Sparkles {...props} />, 
    color: 'bg-gradient-to-br from-purple-200 to-purple-300',
    borderColor: 'border-purple-400'
  },
  { 
    value: 'loved', 
    label: 'Loved', 
    icon: (props) => <Heart {...props} />, 
    color: 'bg-gradient-to-br from-pink-200 to-pink-300',
    borderColor: 'border-pink-400'
  }
];

const energyLevels = [
  { 
    value: 'high', 
    label: 'High', 
    icon: (props) => <Sun {...props} />, 
    color: 'bg-gradient-to-br from-emerald-200 to-emerald-300'
  },
  { 
    value: 'medium', 
    label: 'Medium', 
    icon: (props) => <Cloud {...props} />, 
    color: 'bg-gradient-to-br from-yellow-200 to-yellow-300'
  },
  { 
    value: 'low', 
    label: 'Low', 
    icon: (props) => <CloudRain {...props} />, 
    color: 'bg-gradient-to-br from-blue-200 to-blue-300'
  },
  { 
    value: 'tired', 
    label: 'Tired', 
    icon: (props) => <Moon {...props} />, 
    color: 'bg-gradient-to-br from-indigo-200 to-indigo-300'
  },
  { 
    value: 'restless', 
    label: 'Restless', 
    icon: (props) => <Wind {...props} />, 
    color: 'bg-gradient-to-br from-orange-200 to-orange-300'
  }
];

const CalendarCell = ({ date, entries, onClick, isSelected }) => {
  const dateKey = format(date, 'yyyy-MM-dd');
  const entryCount = entries?.length || 0;
  const isCurrentDay = isToday(date);
  
  const dominantMood = entries?.length > 0 
    ? entries.reduce((acc, entry) => {
        const curr = moods.find(m => m.value === entry.mood);
        return !acc || entries.filter(e => e.mood === entry.mood).length > 
               entries.filter(e => e.mood === acc.value).length ? curr : acc;
      }, null)
    : null;

  return (
    <motion.button
      className={`relative h-24 w-full p-2 rounded-xl transition-all duration-200
        ${dominantMood?.color || 'bg-gray-50 hover:bg-gray-100'} 
        ${isCurrentDay ? 'ring-2 ring-blue-400 shadow-lg' : 'shadow-sm hover:shadow-md'}
        ${isSelected ? 'ring-2 ring-purple-500 scale-95' : ''}
        border border-transparent hover:border-gray-200`}
      onClick={() => onClick(dateKey)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col h-full">
        <span className={`text-sm font-medium ${isCurrentDay ? 'text-blue-600' : 'text-gray-700'}`}>
          {format(date, 'd')}
        </span>
        {entryCount > 0 && (
          <motion.div 
            className="mt-2 space-y-1"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {dominantMood?.icon && (
              <span className="flex justify-center">
                {React.createElement(dominantMood.icon, { 
                  className: "w-6 h-6 text-gray-700",
                  strokeWidth: 1.5 
                })}
              </span>
            )}
            {entryCount > 1 && (
              <span className="text-xs font-medium text-gray-600 bg-white bg-opacity-50 px-2 py-1 rounded-full">
                +{entryCount - 1}
              </span>
            )}
          </motion.div>
        )}
      </div>
    </motion.button>
  );
};

const MoodCard = ({ entry, mood, energy, index }) => (
  <motion.div
    className={`p-6 rounded-xl border ${mood?.borderColor || 'border-gray-200'} 
      ${mood?.color || 'bg-gray-50'} shadow-lg`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.3 }}
  >
    <div className="grid grid-cols-[auto,1fr] gap-6">
      <div className="flex gap-4 items-start">
        <div className="flex flex-col items-center space-y-2">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            {mood?.icon && React.createElement(mood.icon, { 
              className: "w-8 h-8 text-gray-700",
              strokeWidth: 1.5 
            })}
          </div>
          <span className="text-sm font-medium capitalize text-gray-700">
            {mood?.label}
          </span>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            {energy?.icon && React.createElement(energy.icon, { 
              className: "w-8 h-8 text-gray-700",
              strokeWidth: 1.5 
            })}
          </div>
          <span className="text-sm font-medium text-gray-600">
            {energy?.label}
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-center space-y-2">
        <span className="text-sm text-gray-700 bg-white bg-opacity-50 p-2 rounded-lg">
          {entry.triggers?.length > 0 
            ? `Triggers: ${entry.triggers.join(', ')}` 
            : 'No triggers specified'}
        </span>
        <span className="text-xs text-gray-500 flex items-center gap-2">
          <Sun className="w-4 h-4" />
          {format(new Date(entry.timestamp), 'h:mm a')}
        </span>
      </div>
    </div>
  </motion.div>
);

export default function MoodCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: supabaseError } = await supabase
          .from('mood_entries')
          .select('timestamp, mood, energy, triggers')
          .order('timestamp', { ascending: true });

        if (supabaseError) throw supabaseError;
        setEntries(data || []);
      } catch (err) {
        setError('Failed to load mood entries. Please try again later.');
        console.error('Error fetching mood entries:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const entriesByDate = entries.reduce((acc, entry) => {
    const dateKey = format(new Date(entry.timestamp), 'yyyy-MM-dd');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(entry);
    return acc;
  }, {});

  const startOfCurrentMonth = startOfMonth(currentMonth);
  const endOfCurrentMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: startOfCurrentMonth, end: endOfCurrentMonth });

  const handleKeyNavigation = (e, date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedDate(dateKey);
    }
  };

  return (
    <div className="space-y-6 p-4" role="application" aria-label="Mood Calendar">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-3 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-3 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading entries...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-6 bg-red-50 rounded-xl border border-red-200">
          {error}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-7 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div 
              key={day} 
              className="text-center font-medium text-gray-500 pb-2"
            >
              {day}
            </div>
          ))}

          {Array.from({ length: getDay(startOfCurrentMonth) }).map((_, i) => (
            <div key={`empty-${i}`} className="h-24" />
          ))}

          {daysInMonth.map((date) => (
            <CalendarCell
              key={format(date, 'yyyy-MM-dd')}
              date={date}
              entries={entriesByDate[format(date, 'yyyy-MM-dd')]}
              onClick={setSelectedDate}
              isSelected={selectedDate === format(date, 'yyyy-MM-dd')}
            />
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-6 shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  {format(new Date(selectedDate), 'MMMM d, yyyy')}
                </h3>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {(entriesByDate[selectedDate] || []).map((entry, index) => (
                  <MoodCard
                    key={index}
                    entry={entry}
                    mood={moods.find(m => m.value === entry.mood)}
                    energy={energyLevels.find(e => e.value === entry.energy)}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}