import { generateAlternativesPrompt } from '../../lib/aiCoach';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { exerciseName, equipment } = req.body;

    if (!process.env.GROQ_API_KEY) {
      return res.status(200).json([]);
    }

    const prompt = generateAlternativesPrompt(exerciseName, equipment);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Return ONLY JSON array." },
          { role: "user", content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) return res.status(200).json([]);

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const alts = JSON.parse(content);
    return res.status(200).json(Array.isArray(alts) ? alts : []);
  } catch (err) {
    return res.status(200).json([]);
  }
}