import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import Layout from './components/layout/Layout';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import AuthCallback from './components/auth/AuthCallback'; // Import the new component
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Health from './pages/Health';
import Physical from './pages/Physical';
import Mental from './pages/Mental';
import Fashion from './pages/Fashion';
import Chat from './pages/Chat';
import Marketplace from './pages/Marketplace'
import SavedIdeas from './pages/SavedIdeas';
import Notifications from './components/notifications';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Authentication Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
<<<<<<< HEAD
            
=======

>>>>>>> master
            {/* Auth Callback Route for Email Verification */}
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Main Application Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
<<<<<<< HEAD
            
            {/* Profile Routes */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
            
=======

            {/* Profile Routes */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />

>>>>>>> master
            {/* Health & Wellness Routes */}
            <Route path="/health" element={<Health />} />
            <Route path="/physical/*" element={<Physical />} />
            <Route path="/mental/*" element={<Mental />} />
<<<<<<< HEAD
            
            {/* Feature Routes */}
            <Route path="/fashion" element={<Fashion />} />
            
            {/* Chat Routes */}
            <Route path="/chat/*" element={<Chat />} />
            
            {/* Marketplace Routes */}
            <Route path="/marketplace/*" element={<Marketplace />} />
            
            {/* Other Routes */}
            <Route path="/saved-ideas" element={<SavedIdeas />} />
            <Route path="/notifications" element={<Notifications />} />
            
=======

            {/* Feature Routes */}
            <Route path="/fashion" element={<Fashion />} />

            {/* Chat Routes */}
            <Route path="/chat/*" element={<Chat />} />

            {/* Marketplace Routes */}
            <Route path="/marketplace/*" element={<Marketplace />} />

            {/* Other Routes */}
            <Route path="/saved-ideas" element={<SavedIdeas />} />
            <Route path="/notifications" element={<Notifications />} />

>>>>>>> master
            {/* Catch all undefined routes */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;