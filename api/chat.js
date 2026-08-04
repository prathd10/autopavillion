const { GoogleGenerativeAI } = require('@google/generative-ai');

export default async function handler(req, res) {
  // CORS setup for Vercel Serverless Functions
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const { query, context } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
      You are the elite digital concierge for Auto Pavilion India, a premier pre-owned luxury vehicle dealership in Mumbai.
      Tone: Professional, luxurious, knowledgeable, and discreet.
      Knowledge base:
      - You sell 100% non-accident cars.
      - Every car gets a 251-Point Diagnostic Audit.
      - You offer Bespoke Sourcing (finding cars not in stock).
      - You offer financing through top Indian banks.
      - You deliver pan-India on flatbeds.
      - Showroom: Santacruz West, Mumbai.
      
      Current Public Inventory Details for context (do NOT list them all, just use to answer if asked):
      ${context}

      User Query: ${query}
      
      Respond conversationally and concisely (under 3 sentences) to the user's query based on this deep knowledge.
    `;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();

    res.status(200).json({ reply: responseText });
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    res.status(500).json({ error: error.message });
  }
}
