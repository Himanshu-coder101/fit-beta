// lib/planGenerator.js
// Wrapper around aiExerciseSelector

const { generateWorkoutSplit } = require("./aiExerciseSelector");

async function generateProfessionalPlan(profile = {}) {
  return await generateWorkoutSplit(profile);
}

module.exports = { generateProfessionalPlan };
