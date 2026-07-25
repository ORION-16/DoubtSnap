import mongoose from 'mongoose';

const quizQuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String
});

const pdfSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  keyPoints: [String],
  rawText: {
    type: String,
    select: false
  },
  quizGenerated: {
    type: Boolean,
    default: false
  },
  quiz: {
    type: [quizQuestionSchema],
    default: []
  }
}, { timestamps: true });

export default mongoose.model('PDF', pdfSchema);