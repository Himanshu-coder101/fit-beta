// lib/adaptationEngine.js - Intelligent Plan Adaptation

export function analyzeWeeklyFeedback(feedbackArray) {
  if (!feedbackArray || feedbackArray.length === 0) {
    return {
      trend: 'neutral',
      recommendation: 'continue',
      adjustmentFactor: 1.0
    };
  }

  const difficulties = feedbackArray.map(f => f.difficulty);
  const soreness = feedbackArray.map(f => f.soreness);
  const missedReps = feedbackArray.filter(f => f.missedReps).length;

  const easyCount = difficulties.filter(d => d === 'Easy').length;
  const hardCount = difficulties.filter(d => d === 'Hard').length;
  const highSorenessCount = soreness.filter(s => s === 'High').length;

  // Determine adaptation strategy
  let trend = 'neutral';
  let recommendation = 'continue';
  let adjustmentFactor = 1.0;

  if (easyCount >= 3) {
    trend = 'too_easy';
    recommendation = 'increase_intensity';
    adjustmentFactor = 1.1; // 10% increase
  } else if (hardCount >= 3 || highSorenessCount >= 3 || missedReps >= 2) {
    trend = 'too_hard';
    recommendation = 'decrease_volume';
    adjustmentFactor = 0.9; // 10% decrease
  }

  return {
    trend,
    recommendation,
    adjustmentFactor,
    stats: {
      easyCount,
      hardCount,
      highSorenessCount,
      missedReps,
      totalSessions: feedbackArray.length
    }
  };
}

export function shouldRegeneratePlan(profile) {
  const planCreatedAt = profile.planCreatedAt;
  if (!planCreatedAt) return false;

  const weeksSinceCreation = Math.floor(
    (Date.now() - new Date(planCreatedAt).getTime()) / (7 * 24 * 60 * 60 * 1000)
  );

  // Regenerate every 4 weeks for variety
  return weeksSinceCreation >= 4;
}

export function getAdaptationStrategy(experience) {
  const strategies = {
    beginner: {
      weeklyIncrease: 0.025, // 2.5% per week
      deloadFrequency: 6, // Every 6 weeks
      volumeRange: [10, 15] // Total sets per muscle group
    },
    intermediate: {
      weeklyIncrease: 0.05, // 5% per week
      deloadFrequency: 4, // Every 4 weeks
      volumeRange: [15, 20]
    },
    advanced: {
      weeklyIncrease: 0.025, // 2.5% per week (slower, near genetic limit)
      deloadFrequency: 3, // Every 3 weeks
      volumeRange: [20, 25]
    }
  };

  return strategies[experience] || strategies.intermediate;
}
