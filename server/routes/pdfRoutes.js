import express from 'express';
import { uploadPDF, getPDFHistory, deletePDF, generateQuizForPDF } from '../controllers/pdfController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/upload', protect, aiRateLimiter, upload.single('pdf'), uploadPDF);
router.post('/:id/quiz', protect, aiRateLimiter, generateQuizForPDF);
router.get('/history', protect, getPDFHistory);
router.delete('/:id', protect, deletePDF);

export default router;