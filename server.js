const express = require("express");
const Groq = require("groq-sdk");

const app = express();
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/chat", async (req, res) => {
  try {
    const { systemPrompt, history } = req.body;

    if (!history || !Array.isArray(history)) {
      return res.status(400).json({ error: "Missing conversation history" });
    }

    const formatInstructions = {
      role: "system",
      content: (systemPrompt || "You are Mika.") + 
        "\nCRITICAL: You MUST reply strictly in JSON format containing two keys: 'reply' and 'emotion'." + 
        "\nExample: {\"reply\": \"*sighs* What do you want now?\", \"emotion\": \"SASSY\"}" + 
        "\nAllowed emotion values: SASSY, ANGRY, FLUSTERED, HAPPY, NEUTRAL."
    };

    const messages = [formatInstructions, ...history];

    const completion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile",
      max_tokens: 120,
      response_format: { type: "json_object" }
    });

    const rawOutput = completion.choices[0]?.message?.content || "{}";
    const parsedData = JSON.parse(rawOutput);

    res.json({
      response: parsedData.reply || "...",
      reply: parsedData.reply || "...",
      emotion: parsedData.emotion || "NEUTRAL"
    });
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
