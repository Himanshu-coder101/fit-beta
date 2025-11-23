// pages/api/ai-sleep.js - Groq Integration
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const { userInputs } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      return res.status(200).json({
        message: "AI sleep coaching not available",
        fallback: {
          plan: [
            { week: 1, tips: "Consistent sleep schedule", bedtimeRoutine: "No screens 1hr before bed" },
            { week: 2, tips: "Optimize bedroom temp", bedtimeRoutine: "Cool, dark room" }
          ],
          notes: "Aim for 7-9 hours per night"
        }
      });
    }

    const prompt = `You are a sleep coach. Create a 4-week sleep optimization plan for someone with goal ${userInputs.goal}.

Return ONLY valid JSON:
{
  "plan": [
    {"week": 1, "tips": "...", "bedtimeRoutine": "..."}
  ],
  "notes": "General advice"
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
        max_tokens: 1000,
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