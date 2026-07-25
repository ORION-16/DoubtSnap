import rateLimit from 'express-rate-limit';

// Applies to doubt-solving and PDF routes — the expensive Gemini calls
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 8, // max 8 AI requests per minute per user/IP
  message: {
    message: 'You are sending requests too quickly. Please wait a moment before trying again.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Key by user ID (routes are protected, so user is always available)
  keyGenerator: (req) => {
    if (req.user && req.user._id) {
      return req.user._id.toString();
    }
    return 'anonymous';
  }
});