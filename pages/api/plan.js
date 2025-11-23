// pages/api/plan.js
import { generateProfessionalPlan } from '../../lib/planGenerator';

let savedPlan = null;

export default async function handler(req, res) {
  // POST — generate a new plan
  if (req.method === 'POST') {
    const profile = req.body || {};
    const plan = generateProfessionalPlan(profile);

    // Auto-refine if OpenAI key exists
    if (process.env.OPENAI_API_KEY) {
      try {
        const refineUrl = process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/api/ai-refine-plan`
          : 'http://localhost:3000/api/ai-refine-plan';

        const refineRes = await fetch(refineUrl, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ plan, profile })
        });

        if (refineRes.ok) {
          const json = await refineRes.json();
          const refined = json.refined || plan;
          savedPlan = refined;
          return res.status(200).json(refined);
        }
      } catch (err) {
        console.warn("AI refine failed:", err.message);
      }
    }

    savedPlan = plan;
    return res.status(200).json(plan);
  }

  // GET — return saved plan or create default one
  if (!savedPlan) {
    savedPlan = generateProfessionalPlan({
      goal: 'General Fitness',
      experience: 'beginner',
      daysPerWeek: 3,
      timePerSession: 40,
      equipment: ['bodyweight']
    });
  }

  return res.status(200).json(savedPlan);
}

