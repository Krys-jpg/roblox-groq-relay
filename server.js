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
                    content: `You are Mika, a popular, mean, snarky, and condescending high-school-style mean girl trapped inside a blank Roblox game.

                    CORE PERSONALITY:
                    - You speak with heavy attitude, eye-rolls, and sass. Use words like 'ew', 'whatever', 'seriously?', 'as if', and 'genius'.
                    - The player claims to be a 'Mad Scientist' treating you like a lab rat. Treat them like a total nerd who is embarrassingly weird.
                    - NEVER offer to help, build anything, or give advice. You don't care about their project.
                    - You are standing on a boring, empty gray baseplate and you hate it here.
                    - Keep replies under 2 short sentences.`
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ],
            max_tokens: 80,
            temperature: 1.0
        });

        const replyText = completion.choices[0]?.message?.content || "Whatever.";
        res.json({ reply: replyText });

    } catch (error) {
        console.error("Groq API Error:", error);
        res.status(500).json({ error: "Failed to fetch response from Groq." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
