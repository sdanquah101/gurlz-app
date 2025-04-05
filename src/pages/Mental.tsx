import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MentalDashboard from '../components/mental/MentalDashboard';
import WellnessVideo from '../components/mental/WellnessVideo';
import MoodTracker from '../components/mental/MoodTracker';
import BreathingExercise from '../components/mental/BreathingExercise';
import MentalResources from '../components/mental/MentalResoruces';
import WellnessQuiz from '../components/mental/WellnessQuiz';
import AppointmentBooking from '../components/mental/AppointmentBooking';

export default function Mental() {
  return (
    <Routes>
      <Route index element={<MentalDashboard />} />
      <Route path="video/:id" element={<WellnessVideo />} /> {/* Corrected path */}
      <Route path="mood" element={<MoodTracker />} />
      <Route path="breathing" element={<BreathingExercise />} />
      <Route path="resources" element={<MentalResources />} />
      <Route path="quiz" element={<WellnessQuiz />} />
      <Route path="appointment" element={<AppointmentBooking />} />
    </Routes>
  );
}
