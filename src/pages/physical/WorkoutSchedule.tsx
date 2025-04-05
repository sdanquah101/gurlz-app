import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/common/Button';

interface WorkoutEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  duration: number;
}

export default function WorkoutSchedule() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [workouts, setWorkouts] = useState<WorkoutEvent[]>([]);

  const handleAddWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newWorkout: WorkoutEvent = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      type: formData.get('type') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      duration: Number(formData.get('duration'))
    };

    setWorkouts(prev => [...prev, newWorkout]);
    setShowForm(false);
    form.reset();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => navigate('/physical')}
          className="mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Physical
        </Button>
        <h1 className="text-3xl font-bold mb-2">Workout Schedule</h1>
        <p className="text-secondary-light/90">Plan and organize your workouts</p>
      </div>

      {/* Schedule Content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-primary">Weekly Schedule</h2>
          <Button onClick={() => setShowForm(true)}>
            <Plus size={20} className="mr-2" />
            Add Workout
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4 mb-8 overflow-hidden"
              onSubmit={handleAddWorkout}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Workout Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="cardio">Cardio</option>
                    <option value="strength">Strength Training</option>
                    <option value="yoga">Yoga</option>
                    <option value="hiit">HIIT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    min="5"
                    max="180"
                    className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Schedule Workout
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Workouts List */}
        <div className="space-y-4">
          {workouts.map((workout) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-secondary/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{workout.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(workout.date).toLocaleDateString()} at {workout.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary capitalize">
                    {workout.type}
                  </p>
                  <p className="text-sm text-gray-500">
                    {workout.duration} minutes
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {workouts.length === 0 && !showForm && (
            <div className="text-center py-8 text-gray-500">
              No workouts scheduled yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}