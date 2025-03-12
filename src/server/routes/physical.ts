import express from 'express';
import { auth } from '../middleware/auth';
import {
  scheduleWorkout,
  getWorkoutSessions,
  createDietPlan,
  getDietPlan
} from '../controllers/physicalController';

const router = express.Router();

router.post('/workouts', auth, scheduleWorkout);
router.get('/workouts', auth, getWorkoutSessions);
router.post('/diet-plans', auth, createDietPlan);
router.get('/diet-plans', auth, getDietPlan);

export default router;