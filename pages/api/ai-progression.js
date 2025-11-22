import OpenAI from 'openai';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { userInputs } = JSON.parse(req.body);
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `You are a strength coach. Provide a 12-week progressive overload plan for ${userInputs.goal} for ${userInputs.daysPerWeek} days/week. Return JSON {weeks:[{week, focus, progression}]}`;
    const completion = await openai.chat.completions.create({ model: 'gpt-4.1', messages: [{ role: 'user', content: prompt }], temperature: 0.4 });
    const content = completion.choices[0].message.content;
    let json; try { json = JSON.parse(content); } catch (e) { return res.status(500).json({ error: 'AI JSON parse', content }); }
    res.status(200).json(json);
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
}