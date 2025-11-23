// lib/planGenerator.js - COMPLETE REWRITE
const { generateWorkoutSplit } = require("./aiExerciseSelector");

// Comprehensive exercise database
const EXERCISE_DATABASE = {
  // COMPOUND MOVEMENTS - BARBELL
  barbell_squat: { name: "Barbell Back Squat", equipment: ["barbell"], muscle: "legs", type: "compound" },
  front_squat: { name: "Front Squat", equipment: ["barbell"], muscle: "legs", type: "compound" },
  deadlift: { name: "Conventional Deadlift", equipment: ["barbell"], muscle: "back", type: "compound" },
  sumo_deadlift: { name: "Sumo Deadlift", equipment: ["barbell"], muscle: "legs", type: "compound" },
  bench_press: { name: "Barbell Bench Press", equipment: ["barbell"], muscle: "chest", type: "compound" },
  incline_bench: { name: "Incline Barbell Bench Press", equipment: ["barbell"], muscle: "chest", type: "compound" },
  overhead_press: { name: "Barbell Overhead Press", equipment: ["barbell"], muscle: "shoulders", type: "compound" },
  barbell_row: { name: "Barbell Bent-Over Row", equipment: ["barbell"], muscle: "back", type: "compound" },
  
  // COMPOUND MOVEMENTS - DUMBBELL
  db_bench: { name: "Dumbbell Bench Press", equipment: ["dumbbell"], muscle: "chest", type: "compound" },
  db_incline: { name: "Incline Dumbbell Press", equipment: ["dumbbell"], muscle: "chest", type: "compound" },
  db_row: { name: "Dumbbell Single-Arm Row", equipment: ["dumbbell"], muscle: "back", type: "compound" },
  db_shoulder_press: { name: "Dumbbell Shoulder Press", equipment: ["dumbbell"], muscle: "shoulders", type: "compound" },
  goblet_squat: { name: "Goblet Squat", equipment: ["dumbbell"], muscle: "legs", type: "compound" },
  db_rdl: { name: "Dumbbell Romanian Deadlift", equipment: ["dumbbell"], muscle: "legs", type: "compound" },
  db_lunge: { name: "Dumbbell Walking Lunges", equipment: ["dumbbell"], muscle: "legs", type: "compound" },
  
  // COMPOUND MOVEMENTS - BODYWEIGHT
  push_up: { name: "Push-Up", equipment: ["bodyweight"], muscle: "chest", type: "compound" },
  pull_up: { name: "Pull-Up", equipment: ["bodyweight"], muscle: "back", type: "compound" },
  chin_up: { name: "Chin-Up", equipment: ["bodyweight"], muscle: "back", type: "compound" },
  dip: { name: "Dips", equipment: ["bodyweight"], muscle: "chest", type: "compound" },
  squat_bw: { name: "Bodyweight Squat", equipment: ["bodyweight"], muscle: "legs", type: "compound" },
  lunge: { name: "Walking Lunges", equipment: ["bodyweight"], muscle: "legs", type: "compound" },
  pike_pushup: { name: "Pike Push-Up", equipment: ["bodyweight"], muscle: "shoulders", type: "compound" },
  
  // ISOLATION - CHEST
  cable_fly: { name: "Cable Flyes", equipment: ["barbell"], muscle: "chest", type: "isolation" },
  db_fly: { name: "Dumbbell Flyes", equipment: ["dumbbell"], muscle: "chest", type: "isolation" },
  pec_deck: { name: "Pec Deck Machine", equipment: ["barbell"], muscle: "chest", type: "isolation" },
  
  // ISOLATION - BACK
  lat_pulldown: { name: "Lat Pulldown", equipment: ["barbell"], muscle: "back", type: "isolation" },
  cable_row: { name: "Seated Cable Row", equipment: ["barbell"], muscle: "back", type: "isolation" },
  face_pull: { name: "Face Pulls", equipment: ["barbell"], muscle: "back", type: "isolation" },
  straight_arm_pulldown: { name: "Straight Arm Pulldown", equipment: ["barbell"], muscle: "back", type: "isolation" },
  
  // ISOLATION - SHOULDERS
  lateral_raise: { name: "Dumbbell Lateral Raise", equipment: ["dumbbell"], muscle: "shoulders", type: "isolation" },
  front_raise: { name: "Front Raise", equipment: ["dumbbell"], muscle: "shoulders", type: "isolation" },
  rear_delt_fly: { name: "Rear Delt Flyes", equipment: ["dumbbell"], muscle: "shoulders", type: "isolation" },
  cable_lateral: { name: "Cable Lateral Raise", equipment: ["barbell"], muscle: "shoulders", type: "isolation" },
  
  // ISOLATION - ARMS
  barbell_curl: { name: "Barbell Curl", equipment: ["barbell"], muscle: "biceps", type: "isolation" },
  db_curl: { name: "Dumbbell Curl", equipment: ["dumbbell"], muscle: "biceps", type: "isolation" },
  hammer_curl: { name: "Hammer Curl", equipment: ["dumbbell"], muscle: "biceps", type: "isolation" },
  preacher_curl: { name: "Preacher Curl", equipment: ["barbell"], muscle: "biceps", type: "isolation" },
  tricep_pushdown: { name: "Tricep Pushdown", equipment: ["barbell"], muscle: "triceps", type: "isolation" },
  overhead_extension: { name: "Overhead Tricep Extension", equipment: ["dumbbell"], muscle: "triceps", type: "isolation" },
  skull_crusher: { name: "Skull Crushers", equipment: ["barbell"], muscle: "triceps", type: "isolation" },
  
  // ISOLATION - LEGS
  leg_press: { name: "Leg Press", equipment: ["barbell"], muscle: "legs", type: "isolation" },
  leg_curl: { name: "Leg Curl", equipment: ["barbell"], muscle: "legs", type: "isolation" },
  leg_extension: { name: "Leg Extension", equipment: ["barbell"], muscle: "legs", type: "isolation" },
  calf_raise: { name: "Standing Calf Raise", equipment: ["bodyweight"], muscle: "calves", type: "isolation" },
  seated_calf: { name: "Seated Calf Raise", equipment: ["barbell"], muscle: "calves", type: "isolation" },
  
  // CORE
  plank: { name: "Plank", equipment: ["bodyweight"], muscle: "core", type: "isolation" },
  ab_crunch: { name: "Crunches", equipment: ["bodyweight"], muscle: "core", type: "isolation" },
  russian_twist: { name: "Russian Twists", equipment: ["bodyweight"], muscle: "core", type: "isolation" },
  hanging_leg_raise: { name: "Hanging Leg Raise", equipment: ["bodyweight"], muscle: "core", type: "isolation" },
  cable_crunch: { name: "Cable Crunch", equipment: ["barbell"], muscle: "core", type: "isolation" },
};

function getExercisesByEquipment(equipmentList) {
  return Object.values(EXERCISE_DATABASE).filter(ex => 
    ex.equipment.some(eq => equipmentList.includes(eq))
  );
}

function getAlternatives(exerciseName, equipmentType = "gym", limit = 5) {
  const exercise = Object.values(EXERCISE_DATABASE).find(ex => 
    ex.name.toLowerCase() === exerciseName.toLowerCase()
  );
  
  if (!exercise) {
    // If exact match not found, find by partial match
    const partialMatch = Object.values(EXERCISE_DATABASE).find(ex =>
      ex.name.toLowerCase().includes(exerciseName.toLowerCase()) ||
      exerciseName.toLowerCase().includes(ex.name.toLowerCase())
    );
    
    if (partialMatch) {
      return getAlternatives(partialMatch.name, equipmentType, limit);
    }
    
    return [];
  }
  
  const equipmentMap = {
    gym: ["barbell", "dumbbell"],
    dumbbell: ["dumbbell"],
    body: ["bodyweight"]
  };
  
  const allowedEquipment = equipmentMap[equipmentType] || ["barbell", "dumbbell"];
  
  return Object.values(EXERCISE_DATABASE)
    .filter(ex => 
      ex.muscle === exercise.muscle &&
      ex.name !== exercise.name &&
      ex.equipment.some(eq => allowedEquipment.includes(eq))
    )
    .slice(0, limit);
}

function generateCompleteWorkout(profile) {
  const { goal, experience, daysPerWeek, equipment, style } = profile;
  
  const availableExercises = getExercisesByEquipment(equipment || ["barbell", "dumbbell"]);
  
  const repSchemes = {
    strength: { sets: 5, reps: 5, intensity: 85, rest: 180, rir: 1 },
    hypertrophy: { sets: 4, reps: 10, intensity: 75, rest: 90, rir: 2 },
    endurance: { sets: 3, reps: 15, intensity: 65, rest: 60, rir: 3 },
    balanced: { sets: 4, reps: 8, intensity: 80, rest: 120, rir: 2 }
  };
  
  const scheme = repSchemes[style] || repSchemes.balanced;
  
  const sessions = [];
  
  if (daysPerWeek === 3) {
    for (let i = 1; i <= 3; i++) {
      sessions.push({
        day: `Day ${i} - Full Body`,
        exercises: selectExercises(availableExercises, ["legs", "chest", "back"], scheme)
      });
    }
  } else if (daysPerWeek === 4) {
    sessions.push(
      { day: "Day 1 - Upper A", exercises: selectExercises(availableExercises, ["chest", "back", "shoulders"], scheme) },
      { day: "Day 2 - Lower A", exercises: selectExercises(availableExercises, ["legs"], scheme) },
      { day: "Day 3 - Upper B", exercises: selectExercises(availableExercises, ["chest", "back", "biceps", "triceps"], scheme) },
      { day: "Day 4 - Lower B", exercises: selectExercises(availableExercises, ["legs"], scheme) }
    );
  } else if (daysPerWeek === 5) {
    sessions.push(
      { day: "Day 1 - Push", exercises: selectExercises(availableExercises, ["chest", "shoulders", "triceps"], scheme) },
      { day: "Day 2 - Pull", exercises: selectExercises(availableExercises, ["back", "biceps"], scheme) },
      { day: "Day 3 - Legs", exercises: selectExercises(availableExercises, ["legs"], scheme) },
      { day: "Day 4 - Upper", exercises: selectExercises(availableExercises, ["chest", "back"], scheme) },
      { day: "Day 5 - Lower", exercises: selectExercises(availableExercises, ["legs"], scheme) }
    );
  } else if (daysPerWeek >= 6) {
    sessions.push(
      { day: "Day 1 - Push", exercises: selectExercises(availableExercises, ["chest", "shoulders", "triceps"], scheme) },
      { day: "Day 2 - Pull", exercises: selectExercises(availableExercises, ["back", "biceps"], scheme) },
      { day: "Day 3 - Legs", exercises: selectExercises(availableExercises, ["legs"], scheme) },
      { day: "Day 4 - Push", exercises: selectExercises(availableExercises, ["chest", "shoulders", "triceps"], scheme) },
      { day: "Day 5 - Pull", exercises: selectExercises(availableExercises, ["back", "biceps"], scheme) },
      { day: "Day 6 - Legs", exercises: selectExercises(availableExercises, ["legs"], scheme) }
    );
  }
  
  return {
    meta: { generatedAt: new Date().toISOString(), generator: "enhanced-rule-based" },
    profile,
    sessions
  };
}

function selectExercises(availableExercises, targetMuscles, scheme) {
  const selected = [];
  
  for (const muscle of targetMuscles) {
    const compounds = availableExercises.filter(ex => 
      ex.muscle === muscle && ex.type === "compound"
    );
    
    if (compounds.length > 0) {
      const compound = compounds[Math.floor(Math.random() * compounds.length)];
      selected.push({
        ...compound,
        sets: scheme.sets,
        reps: scheme.reps,
        intensity_pct: scheme.intensity,
        rest_sec: scheme.rest,
        rir: scheme.rir,
        notes: `Primary ${muscle} movement`
      });
    }
    
    if (selected.length < 6) {
      const isolations = availableExercises.filter(ex => 
        ex.muscle === muscle && ex.type === "isolation"
      );
      
      if (isolations.length > 0) {
        const isolation = isolations[Math.floor(Math.random() * isolations.length)];
        selected.push({
          ...isolation,
          sets: scheme.sets - 1,
          reps: scheme.reps + 2,
          intensity_pct: scheme.intensity - 10,
          rest_sec: scheme.rest - 30,
          rir: scheme.rir + 1,
          notes: `${muscle} isolation`
        });
      }
    }
  }
  
  return selected;
}

async function generateProfessionalPlan(profile = {}) {
  return generateCompleteWorkout(profile);
}

module.exports = { generateProfessionalPlan, getAlternatives };