// pages/api/plan.js - FIXED VERSION
const { generateProfessionalPlan } = require('../../lib/planGenerator');

let cachedPlan = null;

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const profile = req.body || {};
      
      if (!profile.goal || !profile.experience) {
        return res.status(400).json({ 
          error: "Missing required fields: goal and experience" 
        });
      }

      console.log("Generating plan for profile:", profile);

      const plan = await generateProfessionalPlan(profile);
      
      if (!plan || !plan.sessions || plan.sessions.length === 0) {
        throw new Error("Generated plan has no sessions");
      }

      plan.generatedAt = new Date().toISOString();
      plan.profile = profile;
      
      cachedPlan = plan;
      
      console.log(`Successfully generated plan with ${plan.sessions.length} sessions`);
      
      return res.status(200).json(plan);
    }

    if (req.method === 'GET') {
      if (cachedPlan) {
        return res.status(200).json(cachedPlan);
      }

      const defaultProfile = {
        goal: 'Muscle Gain',
        experience: 'beginner',
        daysPerWeek: 3,
        timePerSession: 40,
        equipment: ['bodyweight', 'dumbbell'],
        style: 'balanced',
        adaptationStyle: 'moderate'
      };

      console.log("No cached plan, generating default plan");
      
      const plan = await generateProfessionalPlan(defaultProfile);
      plan.generatedAt = new Date().toISOString();
      plan.profile = defaultProfile;
      
      cachedPlan = plan;
      
      return res.status(200).json(plan);
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error("Plan generation error:", error);
    
    return res.status(500).json({ 
      error: error.message,
      fallback: {
        sessions: [
          {
            day: "Day 1 - Full Body",
            exercises: [
              {
                name: "Push-Up",
                sets: 3,
                reps: 10,
                intensity_pct: 70,
                rest_sec: 90,
                rir: 2,
                notes: "Bodyweight compound movement",
                equipment: ["bodyweight"],
                muscle: "chest"
              },
              {
                name: "Bodyweight Squat",
                sets: 3,
                reps: 15,
                intensity_pct: 70,
                rest_sec: 90,
                rir: 2,
                notes: "Lower body compound",
                equipment: ["bodyweight"],
                muscle: "legs"
              }
            ]
          }
        ],
        meta: {
          generatedAt: new Date().toISOString(),
          generator: "fallback-emergency"
        }
      }
    });
  }
}