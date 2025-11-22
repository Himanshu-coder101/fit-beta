import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userInputs } = JSON.parse(req.body);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,  // MUST be stored in .env.local
    });

    const prompt = `
    You are an expert fitness coach.

    Create a FULL workout plan based on:
    - Goal: ${userInputs.goal}
    - Experience: ${userInputs.experience}
    - Days/Week: ${userInputs.daysPerWeek}
    - Equipment: ${JSON.stringify(userInputs.equipment)}
    - Preferences: ${JSON.stringify(userInputs.preferences)}

    Return JSON ONLY in this exact format:

    {
      "sessions": [
        {
          "name": "Push",
          "focus": ["chest", "shoulders", "triceps"],
          "exercises": [
            {"name": "Bench Press", "sets": 4, "reps": "6-10"},
            {"name": "Shoulder Press", "sets": 3, "reps": "8-12"}
          ]
        }
      ]
    }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;

    let json;
    try {
      json = JSON.parse(content);
    } catch (e) {
      return res.status(500).json({ error: "AI JSON parsing failed", content });
    }

    res.status(200).json(json);

  } catch (e) {
    console.error("API ERROR:", e);
    res.status(500).json({ error: "Internal server error", details: e.message });
  }
}
