import { PDFParse } from 'pdf-parse';

import PDF from '../models/PDF.js';
import { summarizePDF, generateQuiz } from '../utils/gemini.js';

// @route   POST /api/pdf/upload
export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    // Extract text from the PDF buffer
    const parser = new PDFParse({ data: req.file.buffer });
    const result = await parser.getText();
    const extractedText = result.text;

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({ message: 'Could not extract readable text from this PDF' });
    }

    // Send to Gemini for summary + keyPoints ONLY
    const aiResponse = await summarizePDF(extractedText, req.file.originalname);

    // Save to DB with rawText (quiz defaults to empty array, quizGenerated defaults to false)
    const pdfDoc = await PDF.create({
      user: req.user._id,
      filename: req.file.originalname,
      summary: aiResponse.summary,
      keyPoints: aiResponse.keyPoints,
      rawText: extractedText
    });

    // Return doc, omitting rawText (mongoose will naturally omit it due to select: false, but we can be explicit)
    const pdfResponse = pdfDoc.toObject();
    delete pdfResponse.rawText;

    res.status(201).json(pdfResponse);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/pdf/history
export const getPDFHistory = async (req, res) => {
  try {
    const pdfs = await PDF.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v -rawText'); // Ensure rawText is never sent

    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/pdf/:id
export const deletePDF = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);

    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    if (pdf.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await pdf.deleteOne();
    res.json({ message: 'PDF deleted' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/pdf/:id/quiz
export const generateQuizForPDF = async (req, res) => {
  try {
    // We need to fetch rawText explicitly because it has select: false
    const pdf = await PDF.findById(req.params.id).select('+rawText');

    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    if (pdf.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // If quiz is already generated, return the cached quiz
    if (pdf.quizGenerated && pdf.quiz.length > 0) {
      return res.json({ quiz: pdf.quiz });
    }

    if (!pdf.rawText) {
      return res.status(400).json({ message: 'No raw text found for this PDF to generate a quiz' });
    }

    // Generate quiz using the cached raw text
    const aiResponse = await generateQuiz(pdf.rawText, pdf.filename);

    // Save the new quiz and update flag
    pdf.quiz = aiResponse.quiz;
    pdf.quizGenerated = true;
    await pdf.save();

    res.json({ quiz: pdf.quiz });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};