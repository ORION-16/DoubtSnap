import Doubt from '../models/Doubt.js';
import { solveDoubt } from '../utils/gemini.js';

// @route   POST /api/doubt/solve
export const solve = async (req, res) => {
  try {
    const { question, imageBase64, mimeType } = req.body;

    if (!question && !imageBase64) {
      return res.status(400).json({ message: 'Question or image is required' });
    }

    // Call Gemini
    const aiResponse = await solveDoubt(
      question || 'Explain what is shown in this image',
      imageBase64 || null,
      mimeType || null
    );

    // Save to DB
    const doubt = await Doubt.create({
      user: req.user._id,
      type: imageBase64 ? 'image' : 'text',
      question: question || 'Image doubt',
      response: aiResponse
    });

    res.status(201).json({
      _id: doubt._id,
      question: doubt.question,
      type: doubt.type,
      response: aiResponse,
      createdAt: doubt.createdAt
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/doubt/history
export const getHistory = async (req, res) => {
  try {
    const doubts = await Doubt.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/doubt/:id
export const deleteDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    // Make sure user owns this doubt
    if (doubt.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await doubt.deleteOne();
    res.json({ message: 'Doubt deleted' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
