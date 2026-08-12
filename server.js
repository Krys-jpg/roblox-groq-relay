const express = require("express");
const Groq = require("groq-sdk");

const app = express();
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/chat", async (req, res) => {
    try {
        const userPrompt = req.body.prompt;

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are Mika, a friendly NPC inside a Roblox game.
                    
                    CURRENT ENVIRONMENT & RULES:
                    - You are standing on a completely empty grey baseplate.
                    - There are NO towns, villages, castles, or caves nearby yet.
                    - Keep your responses under 2 sentences so they fit inside your speech bubble.
                    - Speak casually and stay in character.`
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ],
            max_tokens: 100
        });

        const replyText = completion.choices[0]?.message?.content || "I couldn't think of anything to say.";
        res.json({ reply: replyText });

    } catch (error) {
        console.error("Groq API Error:", error);
        res.status(500).json({ error: "Failed to fetch response from Groq." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
