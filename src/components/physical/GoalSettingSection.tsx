import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Droplet, Dumbbell, PersonStanding, Apple, Plus, X, Settings, Activity, Brain, Bike, Medal, Bed, Timer, Heart } from 'lucide-react';

const DEFAULT_ACTIVITIES = [
  {
    id: 'water',
    title: 'Water Intake',
    icon: <Droplet className="w-5 h-5" />,
    unit: 'glasses',
    defaultTarget: 8
  },
  {
    id: 'workout',
    title: 'Workout',
    icon: <Dumbbell className="w-5 h-5" />,
    unit: 'minutes',
    defaultTarget: 30
  },
  {
    id: 'walking',
    title: 'Walking',
    icon: <PersonStanding className="w-5 h-5" />,
    unit: 'steps',
    defaultTarget: 10000
  },
  {
    id: 'meals',
    title: 'Healthy Meals',
    icon: <Apple className="w-5 h-5" />,
    unit: 'meals',
    defaultTarget: 3
  }
];

const PREDEFINED_GOALS = [
  {
    id: 'weight-loss',
    title: 'Weight Loss',
    description: 'Achieve a healthy weight reduction through balanced diet and exercise',
    icon: <Target className="w-6 h-6 text-teal-500" />
  },
  {
    id: 'weight-gain',
    title: 'Weight Gain',
    description: 'Build healthy mass through proper nutrition and strength training',
    icon: <Dumbbell className="w-6 h-6 text-pink-500" />
  },
  {
    id: 'muscle-tone',
    title: 'Muscle Toning',
    description: 'Develop lean muscle and improve body composition',
    icon: <Activity className="w-6 h-6 text-teal-500" />
  },
  {
    id: 'cardio-endurance',
    title: 'Cardio Endurance',
    description: 'Improve cardiovascular fitness and stamina',
    icon: <Heart className="w-6 h-6 text-pink-500" />
  },
  {
    id: 'flexibility',
    title: 'Flexibility',
    description: 'Enhance range of motion and reduce muscle tension',
    icon: <Dumbbell className="w-6 h-6 text-teal-500" />
  },
  {
    id: 'strength',
    title: 'Strength Building',
    description: 'Increase overall strength and muscle power',
    icon: <Dumbbell className="w-6 h-6 text-pink-500" />
  },
  {
    id: 'hiit',
    title: 'HIIT Performance',
    description: 'Boost metabolic rate and exercise efficiency',
    icon: <Timer className="w-6 h-6 text-teal-500" />
  },
  {
    id: 'recovery',
    title: 'Active Recovery',
    description: 'Focus on proper rest and muscle recovery',
    icon: <Bed className="w-6 h-6 text-pink-500" />
  },
  {
    id: 'sports',
    title: 'Sports Performance',
    description: 'Improve specific athletic skills and performance',
    icon: <Medal className="w-6 h-6 text-teal-500" />
  },
  {
    id: 'cardio-cycling',
    title: 'Cycling Performance',
    description: 'Enhance cycling endurance and speed',
    icon: <Bike className="w-6 h-6 text-pink-500" />
  },
  {
    id: 'mental-fitness',
    title: 'Mental Fitness',
    description: 'Reduce stress through mindful movement and exercise',
    icon: <Brain className="w-6 h-6 text-teal-500" />
  },
  {
    id: 'endurance',
    title: 'General Endurance',
    description: 'Build overall stamina and exercise capacity',
    icon: <Activity className="w-6 h-6 text-pink-500" />
  }
];

const Modal = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CustomActivityModal = ({ isOpen, onClose, onAdd }) => {
  const [newActivity, setNewActivity] = useState({
    title: '',
    unit: '',
    defaultTarget: 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...newActivity,
      id: Date.now().toString(),
      icon: <Target className="w-5 h-5" />
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Add Custom Activity</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Activity Name</label>
          <input
            type="text"
            value={newActivity.title}
            onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Unit</label>
          <input
            type="text"
            value={newActivity.unit}
            onChange={(e) => setNewActivity(prev => ({ ...prev, unit: e.target.value }))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Daily Target</label>
          <input
            type="number"
            value={newActivity.defaultTarget}
            onChange={(e) => setNewActivity(prev => ({ ...prev, defaultTarget: Number(e.target.value) }))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-pink-500"
            required
            min="1"
          />
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Add Activity
          </button>
        </div>
      </form>
    </Modal>
  );
};

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2 px-4 text-center ${
      active 
        ? 'border-b-2 border-teal-500 text-teal-500' 
        : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {children}
  </button>
);

const ActivitySettings = ({ activity, onUpdateTarget, onDelete }) => {
  const [target, setTarget] = useState(activity.defaultTarget);

  const handleUpdate = () => {
    onUpdateTarget(activity.id, target);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-3">
        {activity.icon}
        <div>
          <p className="font-medium">{activity.title}</p>
          <p className="text-sm text-gray-500">Target: {target} {activity.unit}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
          className="w-20 p-1 border rounded"
          min="1"
        />
        <button
          onClick={handleUpdate}
          className="px-3 py-1 bg-teal-500 text-white rounded hover:bg-pink-600"
        >
          Update
        </button>
        <button
          onClick={() => onDelete(activity.id)}
          className="p-1 text-red-500 hover:bg-red-50 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const DayProgress = ({ day, activities, targets, onUpdateActivity }) => {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <motion.div
          key={activity.id}
          layout
          className="bg-white rounded-lg p-4 shadow-sm border"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {activity.icon}
              <span className="font-medium">{activity.title}</span>
            </div>
            <span className="text-sm text-gray-500">
              Target: {targets[activity.id]} {activity.unit}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{day[activity.id] || 0}/{targets[activity.id]}</span>
            </div>
            <input
              type="range"
              value={day[activity.id] || 0}
              onChange={(e) => onUpdateActivity(activity.id, Number(e.target.value))}
              min="0"
              max={targets[activity.id]}
              className="w-full"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default function FitnessTracker() {
  const [activeTab, setActiveTab] = useState('goals');
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [progress, setProgress] = useState({});
  const [activities, setActivities] = useState(DEFAULT_ACTIVITIES);
  const [targets, setTargets] = useState({});
  const [showCustomActivityModal, setShowCustomActivityModal] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    const initialTargets = {};
    activities.forEach(activity => {
      initialTargets[activity.id] = activity.defaultTarget;
    });
    setTargets(initialTargets);
  }, [activities]);

  const handleUpdateTarget = (activityId, newTarget) => {
    setTargets(prev => ({
      ...prev,
      [activityId]: newTarget
    }));
  };

  const handleDeleteActivity = (activityId) => {
    setActivities(prev => prev.filter(a => a.id !== activityId));
    const newTargets = { ...targets };
    delete newTargets[activityId];
    setTargets(newTargets);
  };

  const handleAddCustomActivity = (newActivity) => {
    setActivities(prev => [...prev, newActivity]);
    setTargets(prev => ({
      ...prev,
      [newActivity.id]: newActivity.defaultTarget
    }));
  };

  const handleUpdateActivity = (activityId, value) => {
    setProgress(prev => ({
      ...prev,
      [currentDay]: {
        ...(prev[currentDay] || {}),
        [activityId]: value
      }
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6 border-b">
        <div className="flex">
          <TabButton
            active={activeTab === 'goals'}
            onClick={() => setActiveTab('goals')}
          >
            Goals
          </TabButton>
          <TabButton
            active={activeTab === 'activities'}
            onClick={() => setActiveTab('activities')}
          >
            Activities
          </TabButton>
          <TabButton
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </TabButton>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {activeTab === 'goals' && (
          <div className="p-6">
            {!selectedGoal ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PREDEFINED_GOALS.map((goal) => (
                  <motion.button
                    key={goal.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-4 rounded-xl shadow-sm text-left border hover:border-teal-500 transition-colors"
                    onClick={() => setSelectedGoal(goal)}
                  >
                    <div className="flex items-center space-x-3">
                      {goal.icon}
                      <div>
                        <h3 className="font-medium">{goal.title}</h3>
                        <p className="text-sm text-gray-500">{goal.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{selectedGoal.title}</h2>
                  <button
                    onClick={() => setSelectedGoal(null)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Change Goal
                  </button>
                </div>
                {!startDate ? (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium">Start Date</label>
                    <input
                      type="date"
                      className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-pink-500"
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Day {currentDay}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentDay(prev => Math.max(1, prev - 1))}
                          disabled={currentDay === 1}
                          className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentDay(prev => Math.min(31, prev + 1))}
                          disabled={currentDay === 31}
                          className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                    <DayProgress
                      day={progress[currentDay] || {}}
                      activities={activities}
                      targets={targets}
                      onUpdateActivity={handleUpdateActivity}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Daily Activities</h2>
              <button
                onClick={() => setShowCustomActivityModal(true)}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-pink-600 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </button>
            </div>
            <div className="divide-y">
              {activities.map((activity) => (
                <ActivitySettings
                  key={activity.id}
                  activity={activity}
                  onUpdateTarget={handleUpdateTarget}
                  onDelete={handleDeleteActivity}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 space-y-6"
          >
            <h2 className="text-xl font-semibold mb-6">Settings</h2>
            
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <h3 className="font-medium mb-3">Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-teal-500 rounded" />
                    <span>Daily Reminders</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-teal-500 rounded" />
                    <span>Progress Updates</span>
                  </label>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <h3 className="font-medium mb-3">Display</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-primary rounded" />
                    <span>Dark Mode</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-primary rounded" />
                    <span>Compact View</span>
                  </label>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <h3 className="font-medium mb-3">Goal Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Default Goal Duration</label>
                    <select className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                      <option>7 days</option>
                      <option>14 days</option>
                      <option>21 days</option>
                      <option>30 days</option>
                    </select>
                  </div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox text-primary rounded" />
                    <span>Auto-start next goal period</span>
                  </label>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <h3 className="font-medium mb-3">Data Management</h3>
                <div className="space-y-3">
                  <button className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary/10 transition-colors w-full text-left">
                    Export Progress Data
                  </button>
                  <button className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors w-full text-left">
                    Clear All Data
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      <CustomActivityModal
        isOpen={showCustomActivityModal}
        onClose={() => setShowCustomActivityModal(false)}
        onAdd={handleAddCustomActivity}
      />
    </div>
  );
}