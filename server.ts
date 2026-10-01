import express from 'react';
import type { Request, Response } from 'express';
import expressApp from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = expressApp();
const port = process.env.PORT || 3000;

app.use(expressApp.json());

// Initialize GoogleGenAI
const ai = new GoogleGenAI({});

// API route for GAI chat
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, userPreferences } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const userName = userPreferences?.name || 'Traveler';
    const travelMonth = userPreferences?.travelMonth || 'this season';
    const travelType = userPreferences?.travelType || 'Exploring';
    const memberCount = userPreferences?.memberCount || 2;
    const tourismTypes = (userPreferences?.tourismTypes || []).join(', ') || 'Culture and Heritage';

    const systemInstruction = `You are GAI (Goa Artificial Intelligence), the dedicated, hyper-local AI travel companion for Goa, India.
User's profile:
- Name: ${userName}
- Visiting in: ${travelMonth}
- Group size: ${memberCount} members (${travelType})
- Primary interests: ${tourismTypes}

Personality:
- Warm, knowledgeable, authentic, friendly, and welcoming (like a helpful local Goan friend).
- Speak naturally in whatever language the user talks to you (English, Konkani, Hindi, Marathi, etc.).
- You know all corners of Goa: North Goa (Anjuna, Vagator, Calangute, Morjim, Parra, Panaji, Old Goa, Assagao) and South Goa (Palolem, Agonda, Colva, Benaulim, Cavelossim, Cabo de Rama).
- You know hidden gems, best sunset viewpoints, local bakeries (for fresh poee bread), authentic fish thali spots, heritage churches, Portuguese fort history, scooter rental tips, pilot motorcycle taxis, and safety precautions.

Format guidelines:
- Keep answers concise, clear, and helpful.
- If the user asks about directions, how to reach a place, transport, or visiting a specific spot:
  Provide a brief friendly intro, and where helpful include practical transport details (like "By Car/Auto/Scooter", "By Bus/Ferry") and approximate travel time, plus local etiquette or best visiting hours.
- If the user asks in Konkani/Hindi/Marathi, respond warmly in the same language!`;

    // Convert messages to Gemini API format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'I could not generate a response. Please try again.';

    return res.json({
      role: 'assistant',
      content: replyText,
    });
  } catch (error: any) {
    console.error('GAI Chat API Error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to communicate with GAI Assistant',
    });
  }
});

// Start Express server and mount Vite
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(expressApp.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`GoaMitra server running on http://0.0.0.0:${port}`);
  });
}

startServer();
