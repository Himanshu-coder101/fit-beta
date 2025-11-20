// lib/weights.js
// Simple localStorage-backed per-exercise weight tracker.
// Keyed by exercise name (string). Values stored as { weight: number, unit: 'kg'|'lb', updatedAt: ISOString }

const KEY = 'ft_ex_weights_v1';

/** read whole store */
function readStore() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

/** write whole store */
function writeStore(obj) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(obj));
}

/** Get weight object for exerciseName (or null) */
export function getExerciseWeight(exerciseName) {
  if (!exerciseName || typeof window === 'undefined') return null;
  const store = readStore();
  return store[exerciseName] || null;
}

/** Save weight object for exerciseName */
export function setExerciseWeight(exerciseName, weight, unit = 'kg') {
  if (!exerciseName || typeof window === 'undefined') return null;
  const store = readStore();
  store[exerciseName] = { weight: Number(weight) || 0, unit: unit || 'kg', updatedAt: new Date().toISOString() };
  writeStore(store);
  return store[exerciseName];
}

/** Remove stored weight for exerciseName */
export function removeExerciseWeight(exerciseName) {
  if (!exerciseName || typeof window === 'undefined') return;
  const store = readStore();
  delete store[exerciseName];
  writeStore(store);
}

/** Get all stored weights as { name: obj, ... } */
export function getAllWeights() {
  if (typeof window === 'undefined') return {};
  return readStore();
}
