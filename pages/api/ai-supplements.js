// pages/api/ai-supplements.js - Groq Integration
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const { userInputs } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      return res.status(200).json([
        { name: "Protein Powder", dose: "25g post-workout", evidenceSummary: "Well-researched for muscle growth" },
        { name: "Creatine", dose: "5g daily", evidenceSummary: "Improves strength and power" },
        { name: "Vitamin D", dose: "2000 IU daily", evidenceSummary: "Supports bone health" }
      ]);
    }

    const prompt = `You are a sports nutritionist. Recommend safe supplements for:
Goal: ${userInputs.goal}

Return ONLY valid JSON array:
[
  {"name": "Supplement", "dose": "Amount", "evidenceSummary": "Brief evidence"}
]`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
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