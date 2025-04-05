import express from 'express';
import { auth } from '../middleware/auth';
import {
  addCycle,
  getCycles,
  getPrediction
} from '../controllers/reproductiveController';

const router = express.Router();

router.post('/cycles', auth, addCycle);
router.get('/cycles', auth, getCycles);
router.get('/prediction', auth, getPrediction);

export default router;