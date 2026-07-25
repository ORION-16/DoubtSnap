import { PDFParse } from 'pdf-parse';

import PDF from '../models/PDF.js';
import { processPDF } from '../utils/gemini.js';

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

    // Send to Gemini for summary + quiz
    const aiResponse = await processPDF(extractedText, req.file.originalname);

    // Save to DB
    const pdfDoc = await PDF.create({
      user: req.user._id,
      filename: req.file.originalname,
      summary: aiResponse.summary,
      keyPoints: aiResponse.keyPoints,
      quiz: aiResponse.quiz
    });

    res.status(201).json(pdfDoc);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/pdf/history
export const getPDFHistory = async (req, res) => {
  try {
    const pdfs = await PDF.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v');

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