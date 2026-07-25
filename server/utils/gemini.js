import { GoogleGenerativeAI } from '@google/generative-ai';

// Lazy-initialized — these are set on first use, AFTER dotenv.config() has run
let genAI = null;
let model = null;

function getModel() {
  if (!model) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    if (!apiKey.startsWith('AIza')) {
      console.warn(`⚠️  GEMINI_API_KEY has unexpected format (starts with "${apiKey.substring(0, 4)}..."). Expected "AIza..." from Google AI Studio.`);
    }
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }
  return model;
}

/**
 * Strips markdown code fences from LLM output and parses JSON.
 * LLMs sometimes wrap output in ```json ... ``` despite instructions.
 */
function safeParseJSON(text) {
  let cleaned = text.trim();

  // Strip ```json ... ``` or ``` ... ``` fences
  const fenceMatch = cleaned.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('❌ Failed to parse Gemini response as JSON.');
    console.error('Raw response:', text);
    throw new Error('Gemini returned invalid JSON. Check server logs for raw response.');
  }
}

export const solveDoubt = async (question, imageBase64 = null, mimeType = null) => {
  const prompt = `
You are DoubtSnap, an expert AI tutor for students of all levels.

A student has asked the following doubt:
"${question}"

Your job is to provide a clear, structured explanation. Automatically detect the subject (Mathematics, Physics, Chemistry, Biology, History, Geography, Computer Science, English, Economics, or General).

Respond ONLY with a valid JSON object in this exact format, no markdown, no backticks:
{
  "subject": "detected subject",
  "concept": "the core concept being tested",
  "explanation": "clear explanation in simple language",
  "steps": ["step 1", "step 2", "step 3"],
  "resources": ["topic to study 1", "topic to study 2"]
}

Rules:
- steps should be empty array [] if the doubt is conceptual and doesn't need steps
- explanation should be beginner friendly
- resources should be specific topics the student should study next
- Never include markdown or code fences in your response
`;

  try {
    let result;
    const geminiModel = getModel();

    if (imageBase64 && mimeType) {
      // Image + optional text doubt
      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType
        }
      };
      result = await geminiModel.generateContent([prompt, imagePart]);
    } else {
      // Text only doubt
      result = await geminiModel.generateContent(prompt);
    }

    const text = result.response.text().trim();
    return safeParseJSON(text);

  } catch (error) {
    throw new Error(`Gemini error: ${error.message}`);
  }
};

export const processPDF = async (pdfText, filename) => {
  const prompt = `
You are DoubtSnap, an expert AI tutor.

A student has uploaded a PDF document titled "${filename}". Here is the extracted text:

${pdfText.substring(0, 15000)}

Analyze this document and respond ONLY with a valid JSON object in this exact format, no markdown, no backticks:
{
  "summary": "a comprehensive 3-4 paragraph summary of the document",
  "keyPoints": ["key point 1", "key point 2", "key point 3", "key point 4", "key point 5"],
  "quiz": [
    {
      "question": "question based on the document",
      "options": ["option A", "option B", "option C", "option D"],
      "answer": "the correct option exactly as written"
    }
  ]
}

Rules:
- Generate exactly 5 quiz questions
- Questions must be based strictly on the document content
- Never include markdown or code fences in your response
`;

  try {
    const geminiModel = getModel();
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text().trim();
    return safeParseJSON(text);
  } catch (error) {
    throw new Error(`Gemini PDF error: ${error.message}`);
  }
};