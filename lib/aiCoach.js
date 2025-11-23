// lib/aiCoach.js - AI Prompt Engineering Engine

export function generateWorkoutPrompt(profile, previousFeedback = null) {
  const { goal, experience, facility, daysPerWeek, timePerSession, equipment, 
          age, weight, targetWeight, injuries, dislikedExercises, likedExercises,
          cardioPreference } = profile;

  let prompt = `You are an elite personal trainer with 20 years of experience. Create a detailed, science-based workout plan.

CLIENT PROFILE:
- Primary Goal: ${goal}
- Experience Level: ${experience}
- Age: ${age || 'Not specified'}
- Current Weight: ${weight || 'Not specified'} kg
${targetWeight ? `- Target Weight: ${targetWeight} kg` : ''}
- Training Facility: ${facility}
${equipment ? `- Available Equipment: ${equipment.join(', ')}` : ''}
- Training Frequency: ${daysPerWeek} days per week
- Session Duration: ${timePerSession} minutes
- Cardio Preference: ${cardioPreference || 'Optional, not required'}
${injuries ? `- Injuries/Limitations: ${injuries}` : ''}
${dislikedExercises ? `- Dislikes: ${dislikedExercises}` : ''}
${likedExercises ? `- Prefers: ${likedExercises}` : ''}
`;

  if (previousFeedback && previousFeedback.length > 0) {
    prompt += `\n\nPREVIOUS WEEK FEEDBACK:\n`;
    previousFeedback.forEach((fb, i) => {
      prompt += `Session ${i + 1}: Difficulty=${fb.difficulty}, Soreness=${fb.soreness}\n`;
    });
    prompt += `\nADJUST the plan based on feedback. If too easy, increase intensity. If too hard, reduce volume.\n`;
  }

  prompt += generateGoalInstructions(goal);

  prompt += `\n\nRETURN ONLY VALID JSON (no markdown):
{
  "planExplanation": "Your programming strategy",
  "weeklyFocus": "This week's emphasis",
  "sessions": [
    {
      "day": "Day 1 - Push",
      "warmup": "5-10 min warmup",
      "exercises": [
        {
          "name": "Exercise name",
          "sets": 4,
          "reps": "8-10",
          "intensity": "RPE 8",
          "restSeconds": 120,
          "notes": "Form cues",
          "whyIncluded": "Reason for inclusion",
          "musclesTargeted": ["primary", "secondary"]
        }
      ],
      "cooldown": "Stretching 5 min"
    }
  ],
  "nutritionGuidance": {
    "dailyCalories": 2500,
    "macros": {"protein": 180, "carbs": 250, "fats": 70},
    "mealTiming": "Meal timing advice",
    "hydration": "Water recommendation"
  },
  "recoveryAdvice": "Sleep and recovery tips",
  "progressionPlan": "4-week progression strategy"
}`;

  return prompt;
}

function generateGoalInstructions(goal) {
  const instructions = {
    'Fat Loss': `\n\nFAT LOSS PROGRAMMING:
- Compound movements (high calorie burn)
- Higher reps (10-15), shorter rest (60-90s)
- Maintain muscle with progressive overload
- NO excessive cardio unless requested
- Focus on caloric deficit through smart training`,

    'Muscle Gain': `\n\nMUSCLE GAIN PROGRAMMING:
- Compound movements + isolation work
- Rep ranges: 6-12 for compounds, 10-15 for isolation
- Progressive overload is KEY
- Adequate rest: 90-180s between sets
- NO cardio unless specifically requested for conditioning
- Focus: mechanical tension, metabolic stress, muscle damage`,

    'Strength': `\n\nSTRENGTH PROGRAMMING:
- Heavy compound lifts (squat, bench, deadlift, press)
- Low reps (3-6), high intensity (80-90% 1RM)
- Long rest periods (3-5 minutes)
- Minimal isolation work
- Progressive overload with weight increases
- NO cardio that interferes with recovery`,

    'Endurance': `\n\nENDURANCE PROGRAMMING:
- Mix of strength and conditioning
- Higher rep ranges (15-20+)
- Shorter rest periods (30-60s)
- Circuit training acceptable
- Include cardio/conditioning work
- Focus on work capacity and stamina`
  };

  return instructions[goal] || instructions['Muscle Gain'];
}

export function generateNutritionPrompt(profile, workoutPlan) {
  const { goal, weight, targetWeight, age } = profile;
  
  return `You are a registered dietitian. Create a personalized nutrition plan.

CLIENT INFO:
- Goal: ${goal}
- Current Weight: ${weight} kg
${targetWeight ? `- Target Weight: ${targetWeight} kg` : ''}
- Age: ${age}
- Training: ${workoutPlan.sessions.length} days/week

Create a sustainable meal plan that supports their ${goal} goal.

RETURN ONLY VALID JSON:
{
  "dailyCalories": 2500,
  "macros": {"protein": 180, "carbs": 250, "fats": 70},
  "meals": [
    {
      "name": "Breakfast",
      "time": "7:00 AM",
      "description": "Detailed meal description",
      "foods": ["food1", "food2"],
      "macros": {"p": 30, "c": 50, "f": 15},
      "calories": 450
    }
  ],
  "mealTiming": "Pre/post workout nutrition advice",
  "hydration": "Daily water target in liters",
  "supplements": ["Optional supplement suggestions"],
  "tips": ["Practical nutrition tips"]
}`;
}

export function generateAdaptationPrompt(profile, currentPlan, feedback) {
  return `You are analyzing training feedback to adapt the workout plan.

CURRENT PLAN: ${JSON.stringify(currentPlan.sessions, null, 2)}

FEEDBACK FROM PAST WEEK:
${feedback.map((f, i) => `Day ${i+1}: Difficulty=${f.difficulty}, Soreness=${f.soreness}, Missed Reps=${f.missedReps}`).join('\n')}

ADAPTATION RULES:
- If 3+ sessions were "Easy" → Increase intensity by 5-10%
- If 3+ sessions were "Hard" → Decrease volume by 10-15%
- If high soreness (3+ "High") → Add rest day or reduce volume
- If missed reps frequently → Reduce weight or sets
- Maintain exercise variety, don't repeat same exercises

Return adapted plan in same JSON format with:
1. Adjusted sets/reps/intensity
2. New exercise variations if needed
3. Explanation of changes made`;
}
