export function generateWorkoutPrompt(profile, previousFeedback = null) {
  const { goal, experience, daysPerWeek, timePerSession, equipment } = profile;
  
  const eqMap = {
    gym: 'Full gym (barbells, dumbbells, machines)',
    home_equips: 'Home gym (dumbbells, bands)',
    body_only: 'Bodyweight only',
    mixed: 'Mixed equipment'
  };

  let prompt = `You are an elite personal trainer. Create a ${daysPerWeek}-day workout plan.

CLIENT:
- Goal: ${goal}
- Experience: ${experience}
- Equipment: ${eqMap[equipment] || equipment}
- Session time: ${timePerSession} min

REQUIREMENTS:
- Create EXACTLY ${daysPerWeek} workout sessions
- Each session: 5-7 specific exercises
- Include sets, reps (as "8-10" or "12-15"), rest_sec
- Add brief notes for each exercise`;

  if (previousFeedback?.length > 0) {
    const hard = previousFeedback.filter(f => f.difficulty === 'Hard').length;
    const easy = previousFeedback.filter(f => f.difficulty === 'Easy').length;
    
    if (hard >= 2) prompt += `\n\nADJUST: User found workouts TOO HARD. Reduce volume 15%.`;
    if (easy >= 2) prompt += `\n\nADJUST: User found workouts TOO EASY. Increase intensity 15%.`;
  }

  prompt += `\n\nReturn ONLY this JSON (no markdown):
{
  "sessions": [
    {
      "day": "Day 1 - Push",
      "exercises": [
        {"name": "Barbell Bench Press", "sets": 4, "reps": "8-10", "rest_sec": 90, "notes": "Keep elbows 45°"}
      ]
    }
  ]
}`;

  return prompt;
}

export function generateAlternativesPrompt(exerciseName, equipment) {
  return `Give 5 alternatives to "${exerciseName}" using ${equipment}.

Return ONLY JSON array (no markdown):
[
  {"name": "Alternative Exercise", "sets": 3, "reps": "10-12", "rest_sec": 90, "notes": "Why this works"}
]`;
}