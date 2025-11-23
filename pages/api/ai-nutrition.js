// pages/api/ai-nutrition.js
import { generateNutritionPrompt } from '../../lib/aiCoach';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const { profile, workoutPlan } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      return res.status(200).json({
        error: "AI not available",
        message: "Add GROQ_API_KEY for nutrition plans"
      });
    }

    const prompt = generateNutritionPrompt(profile, workoutPlan);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a registered dietitian. Return only valid JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) throw new Error('Groq API failed');

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    content = content.replace(/\`\`\`json\n?/g, "").replace(/\`\`\`\n?/g, "");
    
    const json = JSON.parse(content);
    res.status(200).json(json);
    
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
