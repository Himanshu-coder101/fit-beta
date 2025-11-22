// aiExerciseSelector.js
// Deterministic, input-based workout split generator
// Fixes issue where all user inputs gave the same output

function normalizeInputs(inputs = {}) {
  const goal = (inputs.goal || 'general').toLowerCase();
  const experience = (inputs.experience || 'beginner').toLowerCase();
  const daysPerWeek = Number(inputs.daysPerWeek) || 3;
  const equipment = inputs.equipment || 'minimal';
  const prefs = inputs.preferences || {};

  return { goal, experience, daysPerWeek, equipment, preferences: prefs };
}

// Base templates
const TEMPLATES = {
  fullBody: (days) => {
    const sessions = [];
    for (let i = 1; i <= days; i++) {
      sessions.push({
        name: `Full Body ${i}`,
        focus: ['squat/hinge', 'push', 'pull'],
        slot: i,
      });
    }
    return sessions;
  },

  upperLower: (days) => {
    if (days === 2)
      return [
        { name: 'Upper A', focus: ['push', 'pull'] },
        { name: 'Lower A', focus: ['squat', 'hinge'] },
      ];

    if (days === 4)
      return [
        { name: 'Upper A' },
        { name: 'Lower A' },
        { name: 'Upper B' },
        { name: 'Lower B' },
      ];

    return [
      { name: 'Full Body 1' },
      { name: 'Lower' },
      { name: 'Upper' },
    ];
  },

  pushPullLegs: (days) => {
    const base = [
      { name: 'Push', focus: ['chest', 'shoulders', 'triceps'] },
      { name: 'Pull', focus: ['back', 'biceps'] },
      { name: 'Legs', focus: ['quads', 'hamstrings', 'glutes'] },
    ];

    const sessions = [];
    for (let i = 0; i < days; i++) {
      sessions.push(base[i % 3]);
    }
    return sessions;
  },

  strengthPeaking: (days) => {
    return [
      { name: 'Heavy Lower' },
      { name: 'Heavy Upper' },
      { name: 'Accessory' },
    ].slice(0, Math.max(2, days));
  },
};

// Select split based on user input
function selectTemplate({ goal, experience, daysPerWeek, equipment, preferences }) {
  if (preferences.preferFullBody || (experience === 'beginner' && daysPerWeek <= 3)) {
    return TEMPLATES.fullBody(Math.max(1, Math.min(3, daysPerWeek)));
  }

  if (preferences.upperLowerAffinity || (daysPerWeek === 4 && experience !== 'beginner')) {
    return TEMPLATES.upperLower(daysPerWeek);
  }

  if (goal === 'strength') {
    if (daysPerWeek <= 3) return TEMPLATES.strengthPeaking(daysPerWeek);
    return TEMPLATES.pushPullLegs(daysPerWeek);
  }

  if (goal === 'hypertrophy') {
    if (daysPerWeek >= 5) return TEMPLATES.pushPullLegs(daysPerWeek);
    return TEMPLATES.upperLower(daysPerWeek >= 4 ? 4 : 2);
  }

  if (goal === 'fatloss') {
    return TEMPLATES.fullBody(Math.max(2, Math.min(4, daysPerWeek)));
  }

  if (daysPerWeek >= 3) return TEMPLATES.pushPullLegs(daysPerWeek);

  return TEMPLATES.fullBody(daysPerWeek);
}

// Add equipment aware hints
function enrichWithExerciseHints(sessions, equipment) {
  const eq = Array.isArray(equipment) ? equipment : [String(equipment)];

  return sessions.map((s, idx) => {
    const hints = [];

    if (eq.includes('full-gym') || eq.includes('gym')) {
      if (s.name.toLowerCase().includes('push'))
        hints.push('Bench Press, OHP, Incline DB Press');
      if (s.name.toLowerCase().includes('pull'))
        hints.push('Barbell Row, Lat Pulldown, Chin-ups');
      if (s.name.toLowerCase().includes('leg'))
        hints.push('Squat, Deadlift, Leg Press');
    } else {
      if (s.name.toLowerCase().includes('push'))
        hints.push('Push-ups, Pike Push-ups, DB Shoulder Press');
      if (s.name.toLowerCase().includes('pull'))
        hints.push('Band Rows, Inverted Rows, One-arm DB Rows');
      if (s.name.toLowerCase().includes('leg'))
        hints.push('Split Squats, DB RDLs, Lunges');
    }

    return { ...s, exerciseHints: hints, dayIndex: idx + 1 };
  });
}

// Main exported function
async function generateWorkoutSplit(rawInputs = {}) {
  const inputs = normalizeInputs(rawInputs);

  let sessions = selectTemplate(inputs);
  sessions = enrichWithExerciseHints(sessions, inputs.equipment);

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      generator: 'rule-based-v1',
    },
    inputs,
    sessions,
  };
}

module.exports = { generateWorkoutSplit };
async function fetchAIRecommendations(userInputs) {
  try {
    const response = await fetch("/api/ai-recs", {
      method: "POST",
      body: JSON.stringify({ userInputs }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("AI fetch failed:", err);
    return null;
  }
}
const ai = await fetchAIRecommendations(inputs);
if (ai && ai.sessions) {
  return {
    meta: { generatedAt: new Date().toISOString(), generator: "ai" },
    inputs,
    sessions: ai.sessions,
  };
}
