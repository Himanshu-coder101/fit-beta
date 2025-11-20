// lib/storage.js
const PLAN_KEY = 'ft_plan_v1';
const PROFILE_KEY = 'ft_profile';
const FEEDBACK_KEY = 'ft_feedback_v1';

function load(key, fallback = null) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getPlan() { return load(PLAN_KEY, null); }
export function savePlan(plan) { save(PLAN_KEY, plan); }
export function clearPlan() { if (typeof window !== 'undefined') localStorage.removeItem(PLAN_KEY); }

export function getProfile() { return load(PROFILE_KEY, null); }
export function saveProfile(profile) { save(PROFILE_KEY, profile); }
export function clearProfile() { if (typeof window !== 'undefined') localStorage.removeItem(PROFILE_KEY); }

export function getFeedback() { return load(FEEDBACK_KEY, {}); }
export function saveFeedback(obj) {
  const all = getFeedback() || {};
  all[obj.sessionIndex] = { ...obj, updatedAt: new Date().toISOString() };
  save(FEEDBACK_KEY, all);
}
export function clearFeedback() { if (typeof window !== 'undefined') localStorage.removeItem(FEEDBACK_KEY); }

export default { getPlan, savePlan, clearPlan, getProfile, saveProfile, clearProfile, getFeedback, saveFeedback, clearFeedback };
