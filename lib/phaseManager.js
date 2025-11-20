// lib/phaseManager.js
// Controls training phases based on time since plan creation

export function getWeeksSince(dateString) {
  try {
    const start = new Date(dateString)
    const now = new Date()
    const diff = now - start
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 7))
  } catch {
    return 0
  }
}

export function getPhaseForWeeks(weeks) {
  if (weeks < 2) return "Foundation Phase"
  if (weeks < 5) return "Volume Phase"
  if (weeks < 8) return "Intensity Phase"
  if (weeks < 10) return "Peak Performance Phase"
  return "Deload / Reset Phase"
}

export function suggestSplit(experience, days) {
  if (experience === "beginner") {
    if (days === 3) return "Full Body Split"
    if (days === 4) return "Upper / Lower Split"
    return "Full Body Hybrid"
  }

  if (experience === "intermediate") {
    if (days === 3) return "PPL (3-day version)"
    if (days === 4) return "Upper / Lower Split"
    if (days === 5) return "PPL + Upper/Lower"
    return "PPL (full 6-day)"
  }

  if (experience === "advanced") {
    if (days <= 4) return "Upper / Lower Powerbuilding"
    if (days === 5) return "PPL + Strength Days"
    return "PPL (high volume)"
  }

  return "General Balanced Split"
}
