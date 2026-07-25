/**
 * Standalone test script to verify Gemini API key + model work in isolation.
 * Run: node testGemini.js
 * No Express/auth needed — just loads .env and calls Gemini directly.
 */
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

console.log('--- Gemini API Key Test ---');
console.log(`API Key loaded: ${apiKey ? 'YES' : 'NO'}`);
if (apiKey) {
  console.log(`Key prefix: ${apiKey.substring(0, 6)}...`);
  console.log(`Key length: ${apiKey.length} chars`);
  console.log(`Starts with AIza: ${apiKey.startsWith('AIza') ? '✅ YES' : '❌ NO — this may not be a valid Gemini API key'}`);
}
console.log('');

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY not found in .env. Cannot test.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

async function test() {
  console.log('Sending test prompt to gemini-2.5-flash...');
  try {
    const result = await model.generateContent('What is 2 + 2? Reply with just the number.');
    const text = result.response.text().trim();
    console.log(`✅ Gemini responded: "${text}"`);
    console.log('');
    console.log('🎉 API key and model are working correctly!');
  } catch (error) {
    console.error(`❌ Gemini API call failed: ${error.message}`);
    console.error('');
    if (error.message.includes('API_KEY_INVALID')) {
      console.error('The API key is not valid. Get a new one from https://aistudio.google.com/apikey');
    }
    process.exit(1);
  }
}

test();
