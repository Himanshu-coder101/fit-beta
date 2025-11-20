// lib/planGenerator.js
// Professional plan generator (auto-pick split based on profile by default)

const EXERCISE_POOLS = {
  gym: {
    push: [
      { name: 'Barbell Bench Press', equipment: ['barbell'] },
      { name: 'Incline Dumbbell Press', equipment: ['dumbbell'] },
      { name: 'Machine Chest Press', equipment: ['machine'] },
      { name: 'Standing Overhead Press', equipment: ['barbell'] },
      { name: 'Dumbbell Lateral Raise', equipment: ['dumbbell'] },
      { name: 'Cable Triceps Pushdown', equipment: ['machine'] },
      { name: 'Dips (Assisted/Weighted)', equipment: ['bodyweight'] }
    ],
    pull: [
      { name: 'Pull-ups / Assisted Pull-ups', equipment: ['bodyweight'] },
      { name: 'Barbell Row', equipment: ['barbell'] },
      { name: 'Seated Cable Row', equipment: ['machine'] },
      { name: 'Lat Pulldown', equipment: ['machine'] },
      { name: 'Face Pull', equipment: ['machine'] },
      { name: 'EZ-Bar Curl', equipment: ['barbell'] },
      { name: 'Hammer Curl', equipment: ['dumbbell'] }
    ],
    legs: [
      { name: 'Back Squat', equipment: ['barbell'] },
      { name: 'Romanian Deadlift', equipment: ['barbell'] },
      { name: 'Leg Press', equipment: ['machine'] },
      { name: 'Walking Lunges', equipment: ['dumbbell'] },
      { name: 'Leg Curl', equipment: ['machine'] },
      { name: 'Standing Calf Raise', equipment: ['machine'] },
      { name: 'Goblet Squat', equipment: ['dumbbell'] }
    ],
    upper: [
      { name: 'Incline Dumbbell Press', equipment: ['dumbbell'] },
      { name: 'Barbell Row', equipment: ['barbell'] },
      { name: 'Overhead Press', equipment: ['barbell'] },
      { name: 'Lat Pulldown', equipment: ['machine'] },
      { name: 'Lateral Raise', equipment: ['dumbbell'] },
      { name: 'Cable Row', equipment: ['machine'] }
    ],
    lower: [
      { name: 'Front Squat', equipment: ['barbell'] },
      { name: 'Deadlift (Conventional or Trap)', equipment: ['barbell'] },
      { name: 'Leg Press', equipment: ['machine'] },
      { name: 'Hamstring Curl', equipment: ['machine'] },
      { name: 'Bulgarian Split Squat', equipment: ['dumbbell'] },
      { name: 'Calf Raise', equipment: ['machine'] }
    ],
    full: [
      { name: 'Deadlift', equipment: ['barbell'] },
      { name: 'Bench Press', equipment: ['barbell'] },
      { name: 'Barbell Row', equipment: ['barbell'] },
      { name: 'Goblet Squat', equipment: ['dumbbell'] },
      { name: 'Hanging Knee Raise', equipment: ['bodyweight'] }
    ]
  },

  dumbbell: {
    push: [
      { name: 'Dumbbell Bench Press', equipment: ['dumbbell'] },
      { name: 'Incline Dumbbell Press', equipment: ['dumbbell'] },
      { name: 'Seated Dumbbell Overhead Press', equipment: ['dumbbell'] },
      { name: 'Dumbbell Lateral Raise', equipment: ['dumbbell'] },
      { name: 'Overhead Triceps Extension', equipment: ['dumbbell'] }
    ],
    pull: [
      { name: 'One-arm Dumbbell Row', equipment: ['dumbbell'] },
      { name: 'Dumbbell Romanian Deadlift', equipment: ['dumbbell'] },
      { name: 'Seated Dumbbell Curl', equipment: ['dumbbell'] },
      { name: 'Incline Dumbbell Row', equipment: ['dumbbell'] }
    ],
    legs: [
      { name: 'Dumbbell Goblet Squat', equipment: ['dumbbell'] },
      { name: 'Dumbbell Reverse Lunge', equipment: ['dumbbell'] },
      { name: 'Dumbbell Romanian Deadlift', equipment: ['dumbbell'] },
      { name: 'Single-leg Calf Raise (bodyweight)', equipment: ['bodyweight'] }
    ],
    upper: [
      { name: 'Dumbbell Bench Press', equipment: ['dumbbell'] },
      { name: 'One-arm DB Row', equipment: ['dumbbell'] },
      { name: 'Seated DB Press', equipment: ['dumbbell'] },
      { name: 'DB Lateral Raise', equipment: ['dumbbell'] }
    ],
    lower: [
      { name: 'DB Goblet Squat', equipment: ['dumbbell'] },
      { name: 'DB RDL', equipment: ['dumbbell'] },
      { name: 'DB Reverse Lunge', equipment: ['dumbbell'] }
    ],
    full: [
      { name: 'Goblet Squat', equipment: ['dumbbell'] },
      { name: 'Dumbbell Bench Press', equipment: ['dumbbell'] },
      { name: 'One-arm DB Row', equipment: ['dumbbell'] },
      { name: 'Dumbbell RDL', equipment: ['dumbbell'] }
    ]
  },

  body: {
    push: [
      { name: 'Push-ups (Knee/Full)', equipment: ['bodyweight'] },
      { name: 'Pike Push-ups', equipment: ['bodyweight'] },
      { name: 'Triceps Dips (Chair)', equipment: ['bodyweight'] },
      { name: 'Diamond Push-ups', equipment: ['bodyweight'] }
    ],
    pull: [
      { name: 'Inverted Row (table/low bar)', equipment: ['bodyweight'] },
      { name: 'Band Pull Apart (if band)', equipment: ['bands', 'bodyweight'] },
      { name: 'Doorway Row', equipment: ['bodyweight'] },
      { name: 'Assisted/Negative Pull-up', equipment: ['bodyweight'] }
    ],
    legs: [
      { name: 'Bodyweight Squat', equipment: ['bodyweight'] },
      { name: 'Walking Lunges', equipment: ['bodyweight'] },
      { name: 'Single-leg Romanian Deadlift (bodyweight or light DB)', equipment: ['bodyweight'] },
      { name: 'Glute Bridge', equipment: ['bodyweight'] }
    ],
    upper: [
      { name: 'Push-ups', equipment: ['bodyweight'] },
      { name: 'Inverted Row', equipment: ['bodyweight'] },
      { name: 'Pike Push-ups', equipment: ['bodyweight'] }
    ],
    lower: [
      { name: 'Squat Variation', equipment: ['bodyweight'] },
      { name: 'Glute Bridge', equipment: ['bodyweight'] },
      { name: 'Walking Lunge', equipment: ['bodyweight'] }
    ],
    full: [
      { name: 'Bodyweight Squat', equipment: ['bodyweight'] },
      { name: 'Push-ups', equipment: ['bodyweight'] },
      { name: 'Inverted Row', equipment: ['bodyweight'] },
      { name: 'Glute Bridge', equipment: ['bodyweight'] }
    ]
  }
}

// Helper utilities
function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v))
}

// Determine default split based on experience & days
function autoPickSplit(experience, days) {
  if (experience === 'beginner') {
    if (days <= 3) return { type: 'full', pattern: Array(days).fill('Full') }
    if (days === 4) return { type: 'upperlower', pattern: ['Upper', 'Lower', 'Upper', 'Lower'] }
    return { type: 'upperlower', pattern: Array(days).fill('Upper').map((_,i)=> i%2? 'Lower':'Upper').slice(0,days) }
  }
  if (experience === 'intermediate') {
    if (days <= 3) return { type: 'ppl', pattern: ['Push','Pull','Legs'].slice(0,days) }
    if (days === 4) return { type: 'upperlower', pattern: ['Upper','Lower','Upper','Lower'] }
    if (days === 5) return { type: 'ppl', pattern: ['Push','Pull','Legs','Upper','Lower'].slice(0,5) }
    return { type: 'ppl', pattern: ['Push','Pull','Legs','Upper','Lower','Push','Pull'].slice(0,days) }
  }
  if (experience === 'advanced') {
    if (days <= 3) return { type: 'ppl', pattern: ['Push','Pull','Legs'].slice(0,days) }
    if (days === 4) return { type: 'upperlower', pattern: ['Upper','Lower','Upper','Lower'] }
    if (days === 5) return { type: 'ppl', pattern: ['Push','Pull','Legs','Upper','Lower'].slice(0,5) }
    const full = ['Push','Pull','Legs','Push','Pull','Legs']
    return { type: 'ppl', pattern: full.slice(0, days) }
  }
  return { type: 'full', pattern: Array(days).fill('Full') }
}

// convert equipment flags into primary pool keys: 'gym' | 'dumbbell' | 'body'
function pickPoolKey(equipment = []) {
  const eq = new Set(equipment || [])
  if (eq.has('barbell') || eq.has('machine')) return 'gym'
  if (eq.has('dumbbell') || eq.has('bands')) return 'dumbbell'
  return 'body'
}

// Repetition scheme by experience & goal & exercise type
function schemeFor(exType, experience, goal) {
  let sets = experience === 'beginner' ? 3 : experience === 'intermediate' ? 3 : 4
  let reps = 8
  let intensity = 70
  let rest = 90
  let rir = 2

  if (goal && goal.toLowerCase().includes('strength')) {
    reps = experience === 'beginner' ? 5 : experience === 'intermediate' ? 5 : 3
    intensity = experience === 'beginner' ? 75 : experience === 'intermediate' ? 80 : 85
    rir = 1
    rest = 120
  } else if (goal && goal.toLowerCase().includes('fat')) {
    reps = 10
    intensity = 65
    rest = 60
    sets = Math.max(3, Math.round(sets))
    rir = 2
  } else if (goal && (goal.toLowerCase().includes('muscle') || goal.toLowerCase().includes('hypertrophy'))) {
    reps = experience === 'beginner' ? 8 : experience === 'intermediate' ? 8 : 6
    intensity = experience === 'beginner' ? 65 : experience === 'intermediate' ? 72 : 78
    rest = 75
    rir = 1
  } else {
    reps = experience === 'beginner' ? 8 : experience === 'intermediate' ? 8 : 6
    intensity = experience === 'beginner' ? 65 : experience === 'intermediate' ? 72 : 78
    rest = 75
    rir = 2
  }

  if (exType === 'compound') {
    sets = Math.max(3, sets)
    rest = Math.max(75, rest)
    rir = Math.max(1, rir - 1)
  } else if (exType === 'accessory') {
    sets = 3
    reps = Math.min(12, Math.max(8, reps + 2))
    rir = Math.max(1, rir + 1)
    rest = Math.min(90, rest)
  }

  return { sets, reps, intensity_pct: intensity, rest_sec: rest, rir }
}

// Tag exercises as 'compound' or 'accessory' heuristically
function tagExerciseRole(name) {
  const lower = name.toLowerCase()
  if (lower.includes('squat') || lower.includes('deadlift') || lower.includes('bench') || lower.includes('press') || lower.includes('row') || lower.includes('pull')) {
    return 'compound'
  }
  return 'accessory'
}

// Generate session exercises by slotting compounds first then accessories
function buildSession(poolKey, sessionType, experience, goal, sessionTimeMins) {
  const pool = EXERCISE_POOLS[poolKey] && EXERCISE_POOLS[poolKey][sessionType.toLowerCase()]
  if (!pool || pool.length === 0) return []

  let desired = sessionTimeMins <= 30 ? 3 : sessionTimeMins <= 45 ? 5 : 6
  desired = clamp(desired, 3, 8)

  const compounds = pool.filter(e => tagExerciseRole(e.name) === 'compound')
  const accessories = pool.filter(e => tagExerciseRole(e.name) === 'accessory')

  const chosen = []
  for (let ex of compounds) {
    if (chosen.length >= desired) break
    chosen.push(ex)
    if (chosen.length >= 2 && desired <= 4) break
  }

  for (let ex of accessories) {
    if (chosen.length >= desired) break
    if (!chosen.find(c => c.name === ex.name)) chosen.push(ex)
  }

  let idx = 0
  while (chosen.length < desired && pool.length) {
    const cand = pool[idx % pool.length]
    if (!chosen.find(c => c.name === cand.name)) chosen.push(cand)
    idx++
    if (idx > pool.length * 2) break
  }

  const resulting = chosen.map(ex => {
    const role = tagExerciseRole(ex.name)
    const scheme = schemeFor(role, experience, goal)
    return {
      name: ex.name,
      equipment: ex.equipment,
      sets: scheme.sets,
      reps: scheme.reps,
      intensity_pct: scheme.intensity_pct,
      rest_sec: scheme.rest_sec,
      rir: scheme.rir,
      notes: role === 'compound' ? 'Main compound. Focus on form & progressive overload.' : 'Accessory: control tempo and full range of motion.'
    }
  })

  return resulting
}

// public API: generateProfessionalPlan(profile)
export function generateProfessionalPlan(profile = {}) {
  const p = {
    goal: (profile.goal || 'General Fitness'),
    experience: (profile.experience || 'beginner'),
    daysPerWeek: Number(profile.daysPerWeek) || 3,
    timePerSession: Number(profile.timePerSession) || 40,
    equipment: profile.equipment || ['bodyweight'],
    style: profile.style || 'balanced',
    adaptationStyle: profile.adaptationStyle || 'moderate'
  }

  const poolKey = pickPoolKey(p.equipment)

  let splitInfo
  if (p.style && ['ppl','push/pull/legs','push','pull','legs','upper','lower','full'].includes(String(p.style).toLowerCase())) {
    const s = String(p.style).toLowerCase()
    if (s.includes('ppl') || s.includes('push')) {
      const base = ['Push','Pull','Legs']
      const pattern = []
      for (let i = 0; i < p.daysPerWeek; i++) pattern.push(base[i % base.length])
      splitInfo = { type: 'ppl', pattern }
    } else if (s.includes('upper')) {
      const pattern = []
      for (let i = 0; i < p.daysPerWeek; i++) pattern.push(i % 2 === 0 ? 'Upper' : 'Lower')
      splitInfo = { type: 'upperlower', pattern }
    } else if (s.includes('full')) {
      splitInfo = { type: 'full', pattern: Array(p.daysPerWeek).fill('Full') }
    } else {
      splitInfo = autoPickSplit(p.experience, p.daysPerWeek)
    }
  } else {
    splitInfo = autoPickSplit(p.experience, p.daysPerWeek)
  }

  const sessions = []
  for (let i = 0; i < p.daysPerWeek; i++) {
    const sessionType = splitInfo.pattern[i] || splitInfo.pattern[i % splitInfo.pattern.length] || 'Full'
    let poolSessionKey = sessionType.toLowerCase()
    if (!EXERCISE_POOLS[poolKey][poolSessionKey]) {
      if (sessionType.toLowerCase().includes('push')) poolSessionKey = 'push'
      else if (sessionType.toLowerCase().includes('pull')) poolSessionKey = 'pull'
      else if (sessionType.toLowerCase().includes('leg')) poolSessionKey = 'legs'
      else if (sessionType.toLowerCase().includes('full')) poolSessionKey = 'full'
      else poolSessionKey = 'full'
    }

    const exercises = buildSession(poolKey, poolSessionKey, p.experience, p.goal, p.timePerSession)

    sessions.push({
      day: `Day ${i + 1} - ${sessionType}`,
      exercises
    })
  }

  const recommendations = {
    protein_g_per_kg: p.goal && p.goal.toLowerCase().includes('muscle') ? 1.8 : 1.4,
    stepsPerDay: p.goal && p.goal.toLowerCase().includes('fat') ? 9000 : 7000,
    notes: 'This plan is a coach-like starting point. Log feedback to enable adaptive progression.'
  }

  const description = `${p.goal} program — ${p.experience} — ${p.daysPerWeek}x/week — ${splitInfo.type}`

  return {
    generatedAt: new Date().toISOString(),
    profile: p,
    description,
    sessions,
    recommendations
  }
}

// getAlternatives helper: returns alternatives from pools
export function getAlternatives(exName, poolKey = 'gym', count = 3) {
  try {
    const pools = EXERCISE_POOLS[poolKey] || EXERCISE_POOLS['body'];
    const all = [].concat(...Object.values(pools));
    const tokens = (exName || '').toLowerCase().split(/\W+/).filter(Boolean);
    const scored = all
      .filter(a => a.name !== exName)
      .map(a => {
        const nameTokens = a.name.toLowerCase().split(/\W+/).filter(Boolean);
        let score = 0;
        for (const t of tokens) if (nameTokens.includes(t)) score++;
        return { ex: a, score };
      })
      .sort((a, b) => b.score - a.score || a.ex.name.localeCompare(b.ex.name));
    const filtered = scored.length ? scored.map(s => s.ex) : all;
    return filtered.slice(0, count);
  } catch (e) {
    return [];
  }
}

export default generateProfessionalPlan;
