// pages/api/ai-refine-plan.js

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};
  const { plan, profile } = body;

  if (!plan || !plan.sessions) return res.status(400).json({ error: 'Invalid plan payload' });

  const OPENAI_KEY = process.env.OPENAI_API_KEY || '';

  // If no key, return plan unchanged (fallback)
  if (!OPENAI_KEY) {
    return res.status(200).json({ refined: plan, note: 'no-openai-key-fallback' });
  }

  // Build a compact prompt that asks the model to:
  // - ensure plan matches goal
  // - add per-exercise coaching notes and brief rationale
  // - short JSON-only response with unchanged structure but with "coaching" fields
  const system = `You are a professional strength & conditioning coach. 
Respond in strict JSON only: the exact plan object with the same keys as provided (sessions -> exercises),
but for each exercise add a "coach_note" (1-2 short sentences) and "why_chosen" (one short reason).
Do not add extra keys. Keep coaching concise and practical.`;

  // Build a clean payload summarizing plan (not full huge details) for the model
  const planSummary = {
    profile: profile || plan.profile || {},
    sessions: plan.sessions.map(s => ({
      day: s.day,
      sessionType: s.sessionType || null,
      exercises: s.exercises.map(e => ({ name: e.name, primary: e.primary || null, movement: e.movement || null, sets: e.sets, reps: e.reps }))
    }))
  };

  const userPrompt = `Refine the following plan for goal="${(profile && profile.goal) || (plan.profile && plan.profile.goal) || 'General'}".
Make sure exercises match the goal. For each exercise add short 'coach_note' and 'why_chosen'.
Return only valid JSON matching the original structure with coaching fields.

Plan:
${JSON.stringify(planSummary, null, 2)}
`;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // change to a model you prefer, or gpt-4 if available
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1200,
        temperature: 0.3,
        n: 1
      })
    });

    if (!openaiRes.ok) {
      const txt = await openaiRes.text();
      return res.status(500).json({ error: 'OpenAI error', details: txt });
    }

    const j = await openaiRes.json();
    // The assistant reply likely contains JSON — attempt to parse
    const reply = j.choices?.[0]?.message?.content || j.choices?.[0]?.text || '';
    // Try to extract JSON from the reply
    const jsonStart = reply.indexOf('{');
    const jsonText = jsonStart >= 0 ? reply.slice(jsonStart) : reply;

    let refined;
    try {
      refined = JSON.parse(jsonText);
    } catch (parseErr) {
      // As fallback, return original plan with a note
      return res.status(200).json({ refined: plan, warning: 'could-not-parse-model-output', raw: reply });
    }

    return res.status(200).json({ refined, note: 'refined-by-openai' });
  } catch (err) {
    return res.status(500).json({ error: 'internal', details: err.message });
  }
}
