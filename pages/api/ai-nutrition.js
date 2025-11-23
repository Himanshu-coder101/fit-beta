// pages/api/ai-nutrition.js - Groq Integration
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const { userInputs } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      return res.status(200).json({
        message: "AI nutrition not available",
        fallback: {
          calories: 2500,
          protein: 180,
          carbs: 250,
          fats: 70,
          meals: [
            { name: "Breakfast", description: "Oats with protein powder", macros: { p: 30, c: 50, f: 15 } },
            { name: "Lunch", description: "Chicken with rice and vegetables", macros: { p: 50, c: 80, f: 20 } },
            { name: "Dinner", description: "Salmon with sweet potato", macros: { p: 40, c: 60, f: 25 } }
          ]
        }
      });
    }

    const prompt = `You are a registered dietitian. Create a nutrition plan for:
Goal: ${userInputs.goal}
Experience: ${userInputs.experience}
Days/Week: ${userInputs.daysPerWeek}

Return ONLY valid JSON:
{
  "calories": 2500,
  "protein": 180,
  "carbs": 250,
  "fats": 70,
  "meals": [
    {"name": "Breakfast", "description": "...", "macros": {"p": 30, "c": 50, "f": 15}}
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
        temperature: 0.7,
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