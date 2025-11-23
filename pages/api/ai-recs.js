// pages/api/ai-recs.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(400).json({ error: "POST only" });

  const { userInputs } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Gemini key missing" });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash"
    });

    const prompt = `
      Based on this fitness profile: ${JSON.stringify(userInputs)},
      generate 3–5 workout sessions in JSON:
      { "sessions": [ { "day": "...", "exercises": [] } ] }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const json = JSON.parse(text);
    return res.status(200).json(json);

  } catch (err) {
    console.log("Gemini error:", err);
    return res.status(500).json({ error: "AI failed", details: err });
  }
}
