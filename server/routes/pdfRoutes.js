import express from 'express';
import { uploadPDF, getPDFHistory, deletePDF } from '../controllers/pdfController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

router.post('/upload', protect, upload.single('pdf'), uploadPDF);
router.get('/history', protect, getPDFHistory);
router.delete('/:id', protect, deletePDF);

export default router;