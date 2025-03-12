import express from 'express';
import { auth } from '../middleware/auth';
import { upload } from '../middleware/upload';
import {
  getTrends,
  createTrend,
  likeTrend,
  saveTrend,
  removeSavedTrend,
  searchTrends
} from '../controllers/fashionController';

const router = express.Router();

router.get('/trends', getTrends);
router.post('/trends', auth, upload.single('image'), createTrend);
router.post('/trends/:trendId/like', auth, likeTrend);
router.post('/trends/:trendId/save', auth, saveTrend);
router.delete('/trends/:trendId/save', auth, removeSavedTrend);
router.get('/trends/search', searchTrends);

export default router;