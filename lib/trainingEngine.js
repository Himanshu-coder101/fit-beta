// lib/trainingEngine.js
import { generateProfessionalPlan } from './planGenerator'
import { applyProgressionToExercises } from './progression'
import { getWeeksSince, getPhaseForWeeks, suggestSplit } from './phaseManager'

/**
 * Generate a NEW adaptive plan
 */
export function generateAdaptivePlan(profile = {}) {
  const basePlan = generateProfessionalPlan(profile)

  const now = new Date().toISOString()

  basePlan.generatedAt = now
  basePlan.profile = {
    ...(basePlan.profile || {}),
    ...profile,
    adaptationStyle: profile.adaptationStyle || 'moderate'
  }

  const initialPhase = getPhaseForWeeks(0)

  basePlan.phaseInfo = {
    weeksSinceStart: 0,
    phase: initialPhase,
    split: suggestSplit(
      profile.experience || 'beginner',
      Number(profile.daysPerWeek) || 3
    )
  }

  // Apply progression even on week 1 (mild)
  basePlan.sessions = basePlan.sessions.map(s => ({
    ...s,
    exercises: applyProgressionToExercises(
      s.exercises,
      profile.adaptationStyle,
      null // no feedback on week 1
    )
  }))

  return basePlan
}

/**
 * Adapt an existing plan using user feedback
 */
export function adaptExistingPlan(existingPlan, feedbackSummary = null, profile = {}) {
  if (!existingPlan) {
    return generateAdaptivePlan(profile)
  }

  const combinedProfile = {
    ...(existingPlan.profile || {}),
    ...profile
  }

  const adaptationStyle = combinedProfile.adaptationStyle || 'moderate'

  const weeks = getWeeksSince(existingPlan.generatedAt)
  const phase = getPhaseForWeeks(weeks)

  existingPlan.phaseInfo = {
    weeksSinceStart: weeks,
    phase,
    split: suggestSplit(
      combinedProfile.experience || 'beginner',
      Number(combinedProfile.daysPerWeek) || 3
    )
  }

  const newSessions = existingPlan.sessions.map(s => {
    const progressedExercises = applyProgressionToExercises(
      s.exercises,
      adaptationStyle,
      feedbackSummary
    )
    return { ...s, exercises: progressedExercises }
  })

  const updatedPlan = {
    ...existingPlan,
    sessions: newSessions,
    generatedAt: new Date().toISOString(),
    profile: combinedProfile,
    adaptationSummary: {
      usedStyle: adaptationStyle,
      weeksSinceStart: weeks,
      difficultyIndex:
        feedbackSummary
          ? ((feedbackSummary.difficulty.Easy || 0) -
              (feedbackSummary.difficulty.Hard || 0)) /
            (feedbackSummary.total || 1)
          : 0
    }
  }

  return updatedPlan
}
