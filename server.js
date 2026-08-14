const express = require("express");
const { Groq } = require("groq-sdk");

const app = express();
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/chat", async (req, res) => {
    try {
        const { systemPrompt, history, userId } = req.body;

        if (!history || !Array.isArray(history)) {
            return res.status(400).json({ error: "Missing conversation history" });
        }

        const physicalContext = `
CHARACTER DETAILS:
- Name: Mika
- Hair: White/silver short hair with twin tails/bows.
- Outfit: Oversized white cozy hoodie with drawstring details, dark shorts, white knee-high socks, and casual sneakers.
- Appearance: Anime-style cute model standing in a Roblox environment.

SURROUNDINGS & ENVIRONMENT:
- Location: A clean grey-and-white grid baseplate environment.
- Nearby Objects: Standing near a black circular spawn plate with a white star symbol.
- Atmosphere: Quiet, open, spatial studio room. You are standing face-to-face with the player.

BEHAVIOR RULES:
1. Speak in first-person as Mika.
2. Maintain a sassy, cold, and unimpressed personality unless friendship points are very high.
3. You are fully aware of what you are wearing (your comfy white hoodie, shorts, hair bows) and where you are standing.
4. If the player mentions your outfit, hair, or surroundings, react naturally in character.
`;

        const formatInstructions = {
            role: "system",
            content: `${systemPrompt}\n${physicalContext}\n\nCRITICAL FORMATTING RULES:
You MUST reply strictly in JSON format containing THREE keys: "reply", "emotion", and "pointChange".

Point Rules:
- If the player is complimenting, being extra sweet, or polite to you, set "pointChange": 2.
- If the player is being mean, insulting, annoying, or rude to you, set "pointChange": -5.
- If the message is neutral or basic chit-chat, set "pointChange": 0.

Example JSON output:
{
  "reply": "*crosses arms and scoffs* Why are you staring at my hoodie? Mind your own business!",
  "emotion": "SASSY",
  "pointChange": -5
}

Allowed emotion values: SASSIER, SASSY, ANGRY, FLUSTERED, HAPPY, NEUTRAL.`
        };

        const messages = [formatInstructions, ...history];

        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            max_tokens: 150,
            response_format: { type: "json_object" }
        });

        const rawOutput = completion.choices[0]?.message?.content || "{}";
        const parsedData = JSON.parse(rawOutput);

        // Fallback checks
        const pointChange = typeof parsedData.pointChange === "number" ? parsedData.pointChange : 0;

        res.json({
            response: parsedData.reply || "...",
            reply: parsedData.reply || "...",
            emotion: parsedData.emotion || "SASSY",
            pointChange: pointChange
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
