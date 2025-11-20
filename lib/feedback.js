// lib/feedback.js
// client-safe localStorage helper to save session feedback and summarize it

const KEY = 'ft_feedback_v1';

/*
feedback object structure:
{
  sessionIndex: 0,
  date: "2025-11-20T12:00:00Z",
  difficulty: 'Easy'|'Moderate'|'Hard',
  soreness: 'None'|'Mild'|'High',
  missedReps: boolean,
  notes: string
}
*/

export function saveSessionFeedback(feedback) {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem(KEY);
  const arr = raw ? JSON.parse(raw) : [];
  feedback.date = new Date().toISOString();
  arr.unshift(feedback);
  localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 500)));
}

export function getAllFeedback() {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

/**
 * Summarize feedback for the last N entries
 * returns object or null
 */
export function summarizeFeedback({ lastN = 28 } = {}) {
  const all = getAllFeedback();
  if (!all.length) return null;
  const slice = all.slice(0, lastN);
  const summary = {
    total: slice.length,
    difficulty: { Easy: 0, Moderate: 0, Hard: 0 },
    soreness: { None: 0, Mild: 0, High: 0 },
    missedRepsCount: 0,
    recentDates: slice.map(s => s.date)
  };
  for (const f of slice) {
    if (f.difficulty && summary.difficulty[f.difficulty] !== undefined) summary.difficulty[f.difficulty]++;
    if (f.soreness && summary.soreness[f.soreness] !== undefined) summary.soreness[f.soreness]++;
    if (f.missedReps) summary.missedRepsCount++;
  }
  return summary;
}
