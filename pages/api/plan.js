// pages/api/plan.js
import { generateProfessionalPlan } from '../../lib/planGenerator'

let saved = null

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const profile = req.body || {}
    saved = generateProfessionalPlan(profile)
    return res.status(200).json(saved)
  } else {
    if (!saved) {
      saved = generateProfessionalPlan({ goal: 'General Fitness', experience: 'beginner', daysPerWeek: 3, timePerSession: 40, equipment: ['bodyweight'] })
    }
    return res.status(200).json(saved)
  }
}
