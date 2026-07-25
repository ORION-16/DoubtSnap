import mongoose from 'mongoose';

const doubtSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'image'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  response: {
    subject: String,
    concept: String,
    explanation: String,
    steps: [String],
    resources: [String]
  }
}, { timestamps: true });

export default mongoose.model('Doubt', doubtSchema);