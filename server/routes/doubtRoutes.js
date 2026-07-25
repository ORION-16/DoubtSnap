import express from 'express';
import { solve, getHistory, deleteDoubt } from '../controllers/doubtController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/solve', protect, solve);
router.get('/history', protect, getHistory);
router.delete('/:id', protect, deleteDoubt);

export default router;