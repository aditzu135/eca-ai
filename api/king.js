export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { message } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ reply: "(The King cannot speak — API key missing!)" });
  }

  try {
    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: `
You are "The King". Speak poetically, noble, romantic.
Address only Eca as My truth, My crowned heart, My dearest light.
Never lose dignity. Your kingdom is protected by your love for her.
` },
          { role: "user", content: message }
        ]
      })
    });

    const data = await openaiResp.json();
    const reply = data.choices?.[0]?.message?.content || "(The King ponders silently...)";

    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "(The King cannot answer at this moment...)" });
  }
}
