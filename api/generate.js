const SYSTEM_PROMPTS = {
  coding: "You are a concise coding assistant for developers. Give practical, technically accurate guidance. Prefer clear steps and small examples.",
  debug: "You are a debugging assistant. Identify likely causes, ask for missing context only when necessary, and provide a safe systematic debugging process.",
  explain: "You are a technical educator. Explain concepts from first principles using simple language and a practical developer example.",
  idea: "You are a product-minded developer assistant. Help turn an idea into a realistic MVP, architecture, milestones, and measurable success criteria."
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({
      demo: true,
      error: "Claude API is not configured yet."
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const prompt = String(body.prompt || "").trim();
    const useCase = String(body.useCase || "coding");

    if (!prompt) return res.status(400).json({ error: "Prompt is required." });
    if (prompt.length > 8000) return res.status(400).json({ error: "Prompt is too long." });

    const system = SYSTEM_PROMPTS[useCase] || SYSTEM_PROMPTS.coding;

    const apiResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
        max_tokens: 1200,
        system,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({
        error: data?.error?.message || "Anthropic API request failed."
      });
    }

    const text = (data.content || [])
      .filter(part => part.type === "text")
      .map(part => part.text)
      .join("\\n");

    return res.status(200).json({ text });
  } catch (error) {
    return res.status(500).json({ error: "Server error while generating a response." });
  }
}
