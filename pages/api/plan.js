import { generateWorkoutPrompt } from '../../lib/aiCoach';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const profile = req.body;
    
    if (!profile.goal || !profile.daysPerWeek) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ 
        error: 'GROQ_API_KEY required',
        message: 'Add GROQ_API_KEY to .env.local'
      });
    }

    const feedback = profile.previousFeedback || null;
    const prompt = generateWorkoutPrompt(profile, feedback);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Return ONLY pure JSON. NO markdown." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      return res.status(500).json({ error: "AI service error" });
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const plan = JSON.parse(content);
    
    return res.status(200).json({
      ...plan,
      meta: { generatedAt: new Date().toISOString(), generator: 'ai' },
      profile
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}