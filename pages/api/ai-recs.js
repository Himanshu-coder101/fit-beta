// pages/api/ai-recs.js - Groq Integration
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "POST only" });
  }

  const { userInputs } = req.body;

  if (!process.env.GROQ_API_KEY) {
    console.warn("No GROQ_API_KEY - using fallback");
    return res.status(200).json({ 
      sessions: [],
      message: "AI enhancement not available - using rule-based plan"
    });
  }

  try {
    const prompt = `You are a professional fitness coach. Create a detailed workout plan in JSON format.

User Profile:
- Goal: ${userInputs.goal}
- Experience: ${userInputs.experience}
- Days per week: ${userInputs.daysPerWeek}
- Equipment: ${JSON.stringify(userInputs.equipment)}
- Style: ${userInputs.style || "balanced"}

Return ONLY valid JSON with this structure:
{
  "sessions": [
    {
      "day": "Day 1 - Push",
      "exercises": [
        {
          "name": "Barbell Bench Press",
          "sets": 4,
          "reps": 8,
          "intensity_pct": 75,
          "rest_sec": 120,
          "rir": 2,
          "notes": "Control the weight, focus on form"
        }
      ]
    }
  ]
}

Make sure to:
1. Include ${userInputs.daysPerWeek} sessions
2. 4-6 exercises per session
3. Match equipment to available: ${JSON.stringify(userInputs.equipment)}
4. Return ONLY the JSON, no markdown or explanations`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a professional fitness coach. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      return res.status(500).json({ 
        error: "AI API failed",
        message: "Using fallback plan generation"
      });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let cleanContent = content.trim();
    if (cleanContent.startsWith("```json")) {
      cleanContent = cleanContent.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.replace(/```\n?/g, "");
    }

    const json = JSON.parse(cleanContent);
    
    return res.status(200).json(json);

  } catch (err) {
    console.error("Groq error:", err);
    return res.status(500).json({ 
      error: "AI processing failed", 
      details: err.message,
      message: "Using fallback plan generation"
    });
  }
}