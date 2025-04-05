import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../common/Button';
import BreathingAnimation from './BreathingAnimation';
import ExerciseControls from './ExerciseControls';
import ExerciseSettings from './ExerciseSettings';

export default function BreathingExercise() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    inhaleTime: 4,
    holdTime: 4,
    exhaleTime: 4,
    cycles: 3
  });

  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [progress, setProgress] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);

  const resetExercise = useCallback(() => {
    setIsActive(false);
    setPhase('inhale');
    setProgress(0);
    setCompletedCycles(0);
    setShowSettings(true);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const getPhaseDuration = () => {
      switch (phase) {
        case 'inhale': return settings.inhaleTime;
        case 'hold': return settings.holdTime;
        case 'exhale': return settings.exhaleTime;
      }
    };

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (1 / (getPhaseDuration() * 10));
        
        if (newProgress >= 1) {
          // Move to next phase
          if (phase === 'inhale') {
            setPhase('hold');
          } else if (phase === 'hold') {
            setPhase('exhale');
          } else {
            setPhase('inhale');
            setCompletedCycles(prev => {
              const newCycles = prev + 1;
              if (newCycles >= settings.cycles) {
                setIsActive(false);
                setShowSettings(true);
                return 0;
              }
              return newCycles;
            });
          }
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, phase, settings]);

  const handleStart = () => {
    setShowSettings(false);
    setIsActive(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => navigate('/mental')}
          className="mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Mental Wellness
        </Button>
        <h1 className="text-3xl font-bold mb-2">Breathing Exercise</h1>
        <p className="text-secondary-light/90">Find calm through guided breathing</p>
      </div>

      <div className="max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {showSettings ? (
            <ExerciseSettings
              settings={settings}
              onSettingsChange={setSettings}
              onStart={handleStart}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-8"
            >
              <BreathingAnimation
                phase={phase}
                progress={progress}
              />

              <ExerciseControls
                isActive={isActive}
                onToggle={() => setIsActive(!isActive)}
                onReset={resetExercise}
                completedCycles={completedCycles}
                totalCycles={settings.cycles}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}