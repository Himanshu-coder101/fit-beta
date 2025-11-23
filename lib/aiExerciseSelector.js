// lib/aiExerciseSelector.js
// Deterministic workout generator (AI optional)

function normalizeInputs(inputs = {}) {
  return {
    goal: (inputs.goal || "general").toLowerCase(),
    experience: (inputs.experience || "beginner").toLowerCase(),
    daysPerWeek: Number(inputs.daysPerWeek) || 3,
    equipment: inputs.equipment || "minimal",
    preferences: inputs.preferences || {}
  };
}

const TEMPLATES = {
  fullBody: (days) => {
    const out = [];
    for (let i = 1; i <= days; i++) {
      out.push({ name: `Full Body ${i}`, focus: ["push", "pull", "legs"] });
    }
    return out;
  },

  upperLower: (days) => {
    if (days === 2) return [
      { name: "Upper A" }, { name: "Lower A" }
    ];
    if (days === 4) return [
      { name: "Upper A" }, { name: "Lower A" },
      { name: "Upper B" }, { name: "Lower B" }
    ];
    return TEMPLATES.fullBody(days);
  },

  pushPullLegs: (days) => {
    const base = [
      { name: "Push" }, { name: "Pull" }, { name: "Legs" }
    ];
    return Array.from({ length: days }, (_, i) => base[i % 3]);
  }
};

function selectTemplate({ goal, experience, daysPerWeek }) {
  if (experience === "beginner" && daysPerWeek <= 3)
    return TEMPLATES.fullBody(daysPerWeek);

  if (goal === "strength") return TEMPLATES.pushPullLegs(daysPerWeek);
  if (goal === "hypertrophy") return TEMPLATES.upperLower(daysPerWeek);
  return TEMPLATES.fullBody(daysPerWeek);
}

function enrich(sessions) {
  return sessions.map((s, idx) => ({
    ...s,
    day: `Day ${idx + 1}`,
    exercises: [{ name: "Placeholder Exercise" }]
  }));
}

// 🔥 AI disabled by default — only manual button calls it
async function fetchAIRecommendations() {
  return null;
}

async function generateWorkoutSplit(rawInputs = {}) {
  const inputs = normalizeInputs(rawInputs);

  // Always rule-based
  let sessions = enrich(selectTemplate(inputs));

  return {
    meta: { generatedAt: new Date().toISOString(), generator: "rule-based" },
    inputs,
    sessions
  };
}

module.exports = { generateWorkoutSplit };
