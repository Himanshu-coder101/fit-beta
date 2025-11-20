// lib/progression.js
// Applies weekly progression to sets/reps/intensity based on adaptation style & feedback

/**
 * ex = {
 *   name,
 *   sets,
 *   reps,
 *   intensity_pct,
 *   rest_sec,
 *   rir
 * }
 *
 * Returns modified exercise object
 */

export function applyProgressionToExercises(exercises, adaptationStyle, feedbackSummary) {
  if (!Array.isArray(exercises)) return exercises

  return exercises.map(ex => {
    const updated = { ...ex }

    // Determine adjustment intensity
    let factor = 1.0
    if (adaptationStyle === 'conservative') factor = 0.5
    if (adaptationStyle === 'moderate') factor = 1.0
    if (adaptationStyle === 'aggressive') factor = 1.4

    // Feedback logic
    let easyBias = 0
    let hardBias = 0
    let sorenessBias = 0

    if (feedbackSummary) {
      const { difficulty, soreness } = feedbackSummary

      const total = feedbackSummary.total || 1

      const easyRate = (difficulty.Easy || 0) / total
      const hardRate = (difficulty.Hard || 0) / total
      const sorenessRate = (soreness.High || 0) / total

      easyBias = easyRate * 0.5
      hardBias = hardRate * -0.7
      sorenessBias = sorenessRate * -0.5
    }

    const combinedAdjustment = factor + easyBias + hardBias + sorenessBias

    // Adjust RIR (lower RIR = harder)
    updated.rir = Math.max(0, Math.round((updated.rir - 0.2 * combinedAdjustment) * 10) / 10)

    // Adjust intensity
    updated.intensity_pct = Math.min(90, Math.round(updated.intensity_pct * (1 + 0.02 * combinedAdjustment)))

    // Adjust sets for compound lifts only
    const isCompound = ex.name.toLowerCase().includes("bench") ||
                       ex.name.toLowerCase().includes("squat") ||
                       ex.name.toLowerCase().includes("dead") ||
                       ex.name.toLowerCase().includes("press") ||
                       ex.name.toLowerCase().includes("row")

    if (isCompound) {
      updated.sets = Math.min(6, Math.max(3, Math.round(updated.sets + 0.2 * combinedAdjustment)))
    }

    return updated
  })
}
