import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    const { plan, profile } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
Refine this workout plan based on the user profile.

User profile:
${JSON.stringify(profile, null, 2)}

Current plan:
${JSON.stringify(plan, null, 2)}

Return ONLY the improved JSON.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cleaned = JSON.parse(text);

    return res.status(200).json({ refined: cleaned });

  } catch (err) {
    console.error("AI refine failed:", err);
    return res.status(500).json({ error: "AI error" });
  }
}
