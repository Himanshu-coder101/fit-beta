// pages/api/ai-progression.js - Groq Integration
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const { userInputs } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      return res.status(200).json({
        message: "AI progression not available",
        fallback: {
          weeks: [
            { week: 1, focus: "Foundation", progression: "Learn movement patterns" },
            { week: 2, focus: "Volume", progression: "Increase sets" },
            { week: 3, focus: "Intensity", progression: "Increase weight 5%" }
          ]
        }
      });
    }

    const prompt = `You are a strength coach. Create a 12-week progression plan for ${userInputs.goal} with ${userInputs.daysPerWeek} days/week.

Return ONLY valid JSON:
{
  "weeks": [
    {"week": 1, "focus": "Foundation", "progression": "Learn patterns"},
    {"week": 2, "focus": "Volume", "progression": "Add sets"}
  ]
}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) throw new Error('API failed');

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    
    const json = JSON.parse(content);
    res.status(200).json(json);
    
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}