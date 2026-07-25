import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import doubtRoutes from './routes/doubtRoutes.js';


// Load env variables
dotenv.config();

// Startup sanity check for critical env vars
const _geminiKey = process.env.GEMINI_API_KEY;
if (!_geminiKey) {
  console.warn('⚠️  GEMINI_API_KEY is NOT set in .env — Gemini routes will fail');
} else {
  console.log(`✅ GEMINI_API_KEY loaded (${_geminiKey.substring(0, 6)}...)`);
}

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'DoubtSnap API is running' });
});

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/doubt', doubtRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});