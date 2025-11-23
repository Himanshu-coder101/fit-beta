// pages/api/ai-recs.js - Enhanced AI Workout Generation
import { generateWorkoutPrompt } from '../../lib/aiCoach';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "POST only" });
  }

  const { userInputs, previousFeedback } = req.body;

  if (!process.env.GROQ_API_KEY) {
    console.warn("No GROQ_API_KEY");
    return res.status(200).json({ 
      error: "AI not available",
      message: "Add GROQ_API_KEY to use AI features"
    });
  }

  try {
    const prompt = generateWorkoutPrompt(userInputs, previousFeedback);

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
            content: "You are an elite personal trainer. Always respond with valid JSON only. No markdown formatting."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      return res.status(500).json({ 
        error: "AI API failed",
        details: errorText
      });
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();

    // Clean markdown formatting
    content = content.replace(/\`\`\`json\n?/g, "").replace(/\`\`\`\n?/g, "").trim();

    const json = JSON.parse(content);
    
    // Validate response
    if (!json.sessions || json.sessions.length === 0) {
      throw new Error("AI generated invalid plan");
    }

    return res.status(200).json(json);

  } catch (err) {
    console.error("AI generation error:", err);
    return res.status(500).json({ 
      error: "AI processing failed", 
      details: err.message
    });
  }
}
