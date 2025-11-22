import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { userInputs } = JSON.parse(req.body);
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `You are a registered dietitian. Create a 7-day nutrition plan for:\nGoal: ${userInputs.goal}\nExperience: ${userInputs.experience}\nDays/Week: ${userInputs.daysPerWeek}\nEquipment: ${JSON.stringify(userInputs.equipment)}\nPreferences: ${JSON.stringify(userInputs.preferences)}\n\nReturn JSON with: calories, protein, carbs, fats, meals: [{name, description, macros}]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    let json;
    try { json = JSON.parse(content); } catch (e) { return res.status(500).json({ error: 'AI JSON parse', content }); }
    res.status(200).json(json);
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
}