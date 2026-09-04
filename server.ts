import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini instance
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Math Tutor endpoint
app.post('/api/gemini/tutor', async (req, res) => {
  const { question, studentAnswer, grade, topic } = req.body;

  try {
    const ai = getAiClient();
    if (!ai) {
      // Offline / fallback response
      return res.json({
        hint: `Think step-by-step! Break the numbers into simpler parts (tens and ones), and you'll find the pattern.`,
        encouragement: `You're doing great! Keep practicing!`,
      });
    }

    const prompt = `You are "Questie the Math Fox", a friendly, cheerful math companion for a Grade ${grade || 3} primary school student.
The student is practicing "${topic || 'Mathematics'}".
The question is: "${question || ''}".
The student answered: "${studentAnswer || ''}".
Provide:
1. A very short, encouraging friendly phrase.
2. A gentle, conceptual step-by-step hint (DO NOT give the direct final answer; teach them how to think through it).
Return your response as simple JSON with keys: "encouragement" and "hint".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      encouragement: parsed.encouragement || "Great effort! You've got this!",
      hint: parsed.hint || "Let's break the problem down into smaller steps!",
    });
  } catch (err: any) {
    console.warn('Gemini tutor fallback triggered:', err?.message || err);
    return res.json({
      encouragement: "Great effort! Let's solve it together.",
      hint: "Remember to check each part step-by-step, starting with the ones and tens place!",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MATH CHAMPIONS server running on http://localhost:${PORT}`);
  });
}

startServer();
