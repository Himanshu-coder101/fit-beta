// migration-script.js
// Run with: node migration-script.js

const fs = require('fs');
const path = require('path');

console.log('🏋️ FitTrack Pro - Auto Migration Script\n');
console.log('='.repeat(50));

// Backup directory
const backupDir = path.join(__dirname, 'backup_' + Date.now());

// Create backup
function createBackup() {
  console.log('\n📦 Creating backup...');
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  const filesToBackup = [
    'lib/planGenerator.js',
    'pages/api/ai-recs.js',
    'pages/api/ai-nutrition.js',
    'pages/api/ai-progression.js',
    'pages/api/ai-sleep.js',
    'pages/api/ai-supplements.js',
    'pages/api/plan.js',
    'pages/dashboard.js',
    'pages/day/[day].js'
  ];
  
  filesToBackup.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
      const backupPath = path.join(backupDir, file);
      const backupFileDir = path.dirname(backupPath);
      
      if (!fs.existsSync(backupFileDir)) {
        fs.mkdirSync(backupFileDir, { recursive: true });
      }
      
      fs.copyFileSync(fullPath, backupPath);
      console.log(`  ✅ Backed up: ${file}`);
    }
  });
  
  console.log(`\n✅ Backup created at: ${backupDir}`);
}

// File contents
const files = {
  'lib/aiCoach.js': `// lib/aiCoach.js - AI Prompt Engineering Engine

export function generateWorkoutPrompt(profile, previousFeedback = null) {
  const { goal, experience, facility, daysPerWeek, timePerSession, equipment, 
          age, weight, targetWeight, injuries, dislikedExercises, likedExercises,
          cardioPreference } = profile;

  let prompt = \`You are an elite personal trainer with 20 years of experience. Create a detailed, science-based workout plan.

CLIENT PROFILE:
- Primary Goal: \${goal}
- Experience Level: \${experience}
- Age: \${age || 'Not specified'}
- Current Weight: \${weight || 'Not specified'} kg
\${targetWeight ? \`- Target Weight: \${targetWeight} kg\` : ''}
- Training Facility: \${facility}
\${equipment ? \`- Available Equipment: \${equipment.join(', ')}\` : ''}
- Training Frequency: \${daysPerWeek} days per week
- Session Duration: \${timePerSession} minutes
- Cardio Preference: \${cardioPreference || 'Optional, not required'}
\${injuries ? \`- Injuries/Limitations: \${injuries}\` : ''}
\${dislikedExercises ? \`- Dislikes: \${dislikedExercises}\` : ''}
\${likedExercises ? \`- Prefers: \${likedExercises}\` : ''}
\`;

  if (previousFeedback && previousFeedback.length > 0) {
    prompt += \`\\n\\nPREVIOUS WEEK FEEDBACK:\\n\`;
    previousFeedback.forEach((fb, i) => {
      prompt += \`Session \${i + 1}: Difficulty=\${fb.difficulty}, Soreness=\${fb.soreness}\\n\`;
    });
    prompt += \`\\nADJUST the plan based on feedback. If too easy, increase intensity. If too hard, reduce volume.\\n\`;
  }

  prompt += generateGoalInstructions(goal);

  prompt += \`\\n\\nRETURN ONLY VALID JSON (no markdown):
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
}\`;

  return prompt;
}

function generateGoalInstructions(goal) {
  const instructions = {
    'Fat Loss': \`\\n\\nFAT LOSS PROGRAMMING:
- Compound movements (high calorie burn)
- Higher reps (10-15), shorter rest (60-90s)
- Maintain muscle with progressive overload
- NO excessive cardio unless requested
- Focus on caloric deficit through smart training\`,

    'Muscle Gain': \`\\n\\nMUSCLE GAIN PROGRAMMING:
- Compound movements + isolation work
- Rep ranges: 6-12 for compounds, 10-15 for isolation
- Progressive overload is KEY
- Adequate rest: 90-180s between sets
- NO cardio unless specifically requested for conditioning
- Focus: mechanical tension, metabolic stress, muscle damage\`,

    'Strength': \`\\n\\nSTRENGTH PROGRAMMING:
- Heavy compound lifts (squat, bench, deadlift, press)
- Low reps (3-6), high intensity (80-90% 1RM)
- Long rest periods (3-5 minutes)
- Minimal isolation work
- Progressive overload with weight increases
- NO cardio that interferes with recovery\`,

    'Endurance': \`\\n\\nENDURANCE PROGRAMMING:
- Mix of strength and conditioning
- Higher rep ranges (15-20+)
- Shorter rest periods (30-60s)
- Circuit training acceptable
- Include cardio/conditioning work
- Focus on work capacity and stamina\`
  };

  return instructions[goal] || instructions['Muscle Gain'];
}

export function generateNutritionPrompt(profile, workoutPlan) {
  const { goal, weight, targetWeight, age } = profile;
  
  return \`You are a registered dietitian. Create a personalized nutrition plan.

CLIENT INFO:
- Goal: \${goal}
- Current Weight: \${weight} kg
\${targetWeight ? \`- Target Weight: \${targetWeight} kg\` : ''}
- Age: \${age}
- Training: \${workoutPlan.sessions.length} days/week

Create a sustainable meal plan that supports their \${goal} goal.

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
}\`;
}

export function generateAdaptationPrompt(profile, currentPlan, feedback) {
  return \`You are analyzing training feedback to adapt the workout plan.

CURRENT PLAN: \${JSON.stringify(currentPlan.sessions, null, 2)}

FEEDBACK FROM PAST WEEK:
\${feedback.map((f, i) => \`Day \${i+1}: Difficulty=\${f.difficulty}, Soreness=\${f.soreness}, Missed Reps=\${f.missedReps}\`).join('\\n')}

ADAPTATION RULES:
- If 3+ sessions were "Easy" → Increase intensity by 5-10%
- If 3+ sessions were "Hard" → Decrease volume by 10-15%
- If high soreness (3+ "High") → Add rest day or reduce volume
- If missed reps frequently → Reduce weight or sets
- Maintain exercise variety, don't repeat same exercises

Return adapted plan in same JSON format with:
1. Adjusted sets/reps/intensity
2. New exercise variations if needed
3. Explanation of changes made\`;
}
`,

  'lib/adaptationEngine.js': `// lib/adaptationEngine.js - Intelligent Plan Adaptation

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
`,

  'pages/api/ai-recs.js': `// pages/api/ai-recs.js - Enhanced AI Workout Generation
import { generateWorkoutPrompt } from '../../lib/aiCoach';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "POST only" });
  }

  const { userInputs, previousFeedback } = req.body;

  if (!process.env.GROQ_API_KEY) {
    console.warn("No GROQ_API_KEY");
    return res.status(200).json({ 
      error: "AI not available",
      message: "Add GROQ_API_KEY to use AI features"
    });
  }

  try {
    const prompt = generateWorkoutPrompt(userInputs, previousFeedback);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${process.env.GROQ_API_KEY}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are an elite personal trainer. Always respond with valid JSON only. No markdown formatting."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      return res.status(500).json({ 
        error: "AI API failed",
        details: errorText
      });
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();

    // Clean markdown formatting
    content = content.replace(/\\\`\\\`\\\`json\\n?/g, "").replace(/\\\`\\\`\\\`\\n?/g, "").trim();

    const json = JSON.parse(content);
    
    // Validate response
    if (!json.sessions || json.sessions.length === 0) {
      throw new Error("AI generated invalid plan");
    }

    return res.status(200).json(json);

  } catch (err) {
    console.error("AI generation error:", err);
    return res.status(500).json({ 
      error: "AI processing failed", 
      details: err.message
    });
  }
}
`,

  'pages/api/ai-nutrition.js': `// pages/api/ai-nutrition.js
import { generateNutritionPrompt } from '../../lib/aiCoach';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const { profile, workoutPlan } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      return res.status(200).json({
        error: "AI not available",
        message: "Add GROQ_API_KEY for nutrition plans"
      });
    }

    const prompt = generateNutritionPrompt(profile, workoutPlan);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${process.env.GROQ_API_KEY}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a registered dietitian. Return only valid JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) throw new Error('Groq API failed');

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    content = content.replace(/\\\`\\\`\\\`json\\n?/g, "").replace(/\\\`\\\`\\\`\\n?/g, "");
    
    const json = JSON.parse(content);
    res.status(200).json(json);
    
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
`,

  'pages/api/adapt-plan.js': `// pages/api/adapt-plan.js - NEW FILE
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
        "Authorization": \`Bearer \${process.env.GROQ_API_KEY}\`,
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
    content = content.replace(/\\\`\\\`\\\`json\\n?/g, "").replace(/\\\`\\\`\\\`\\n?/g, "");
    
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
`
};

function writeFiles() {
  console.log('\n📝 Writing new files...');
  
  Object.entries(files).forEach(([filePath, content]) => {
    const fullPath = path.join(__dirname, filePath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`  ✅ Created/Updated: ${filePath}`);
  });
}

function createEnvExample() {
  const envContent = `# Get free API key from: https://console.groq.com/keys
GROQ_API_KEY=

# Optional: Supabase
# SUPABASE_URL=
# SUPABASE_ANON_KEY=`;

  const envPath = path.join(__dirname, '.env.example');
  if (!fs.existsSync(path.join(__dirname, '.env.local'))) {
    fs.writeFileSync(path.join(__dirname, '.env.local'), envContent);
    console.log('  ✅ Created .env.local');
  }
  fs.writeFileSync(envPath, envContent);
  console.log('  ✅ Created .env.example');
}

function verifyMigration() {
  console.log('\n🔍 Verifying migration...');
  
  let allGood = true;
  Object.keys(files).forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) {
      console.log(`  ❌ Missing: ${file}`);
      allGood = false;
    } else {
      console.log(`  ✅ Verified: ${file}`);
    }
  });
  
  return allGood;
}

// Run migration
try {
  createBackup();
  writeFiles();
  createEnvExample();
  
  if (verifyMigration()) {
    console.log('\n' + '='.repeat(50));
    console.log('✅ MIGRATION SUCCESSFUL!');
    console.log('='.repeat(50));
    console.log(`\n📦 Backup saved at: ${backupDir}`);
    console.log('\n🚀 Next steps:');
    console.log('  1. Get free Groq API key: https://console.groq.com');
    console.log('  2. Add to .env.local: GROQ_API_KEY=your_key_here');
    console.log('  3. Run: npm install');
    console.log('  4. Run: npm run dev');
    console.log('  5. Open: http://localhost:3000\n');
  } else {
    console.log('\n❌ Some files failed to migrate. Check errors above.');
    process.exit(1);
  }
} catch (error) {
  console.error('\n❌ Migration failed:', error.message);
  console.log(`\n🔄 To rollback, run: node rollback-script.js ${backupDir}`);
  process.exit(1);
}