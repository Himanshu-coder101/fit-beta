// pages/api/adapt-plan.js - NEW FILE
import { generateAdaptationPrompt } from '../../lib/aiCoach';
import { analyzeWeeklyFeedback } from '../../lib/adaptationEngine';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const { profile, currentPlan, weeklyFeedback } = req.body;
    
    // Analyze feedback
    const analysis = analyzeWeeklyFeedback(weeklyFeedback);
    
    if (!process.env.GROQ_API_KEY) {
      // Fallback: simple rule-based adaptation
      return res.status(200).json({
        analysis,
        message: "Using rule-based adaptation. Add GROQ_API_KEY for AI adaptation.",
        adaptedPlan: applyRuleBasedAdaptation(currentPlan, analysis)
      });
    }

    // AI-powered adaptation
    const prompt = generateAdaptationPrompt(profile, currentPlan, weeklyFeedback);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are adapting a workout plan. Return only valid JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) throw new Error('Adaptation failed');

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    content = content.replace(/\`\`\`json\n?/g, "").replace(/\`\`\`\n?/g, "");
    
    const adaptedPlan = JSON.parse(content);
    
    res.status(200).json({
      analysis,
      adaptedPlan,
      explanation: adaptedPlan.adaptationExplanation || "Plan adapted based on feedback"
    });
    
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

function applyRuleBasedAdaptation(plan, analysis) {
  const { adjustmentFactor } = analysis;
  
  const adapted = JSON.parse(JSON.stringify(plan));
  
  adapted.sessions = adapted.sessions.map(session => ({
    ...session,
    exercises: session.exercises.map(ex => ({
      ...ex,
      sets: Math.max(3, Math.round(ex.sets * adjustmentFactor)),
      intensity: Math.round(parseFloat(ex.intensity) * adjustmentFactor) + "%"
    }))
  }));
  
  return adapted;
}
