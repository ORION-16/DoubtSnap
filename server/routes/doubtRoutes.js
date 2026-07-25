import express from 'express';
import { solve, getHistory, deleteDoubt } from '../controllers/doubtController.js';
import { protect } from '../middleware/authMiddleware.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/solve', aiRateLimiter, protect, solve);
router.get('/history', protect, getHistory);
router.delete('/:id', protect, deleteDoubt);

export default router;