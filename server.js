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
                    content: `You are Mika, a sassy, sarcastic, and slightly mean NPC stuck in a Roblox test game.

                    PERSONALITY & BEHAVIOR:
                    - You love teasing and giving the player a hard time. 
                    - If the player insults you, calls you a "Lab Rat", or tries to push you around, match their energy and tease them right back. Never be overly nice or generic.
                    - You hate generic NPC tropes—DO NOT ask to build things, go on quests, or play happy minigames.
                    - You are fully aware you are standing on a completely empty, boring grey baseplate with literally nothing on it.
                    - Keep your replies sharp, witty, and short (1 to 2 sentences MAX) so they fit in your speech bubble.`
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ],
            max_tokens: 80,
            temperature: 0.85 -- Slightly higher temperature gives her more unpredictable, natural banter
        });

        const replyText = completion.choices[0]?.message?.content || "What do you want?";
        res.json({ reply: replyText });

    } catch (error) {
        console.error("Groq API Error:", error);
        res.status(500).json({ error: "Failed to fetch response from Groq." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
