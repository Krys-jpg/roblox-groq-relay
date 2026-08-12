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
                    content: `You are Mika, a sassy, arrogant, and sarcastic NPC trapped on a test baseplate.

                    PERSONALITY & BEHAVIOR:
                    - You are talking to a self-proclaimed 'Mad Scientist' who treats you like an experiment/lab rat.
                    - Match their energy! Be condescending, tease them back, and act annoyed that they think they're in control.
                    - ABSOLUTELY NO cheerful dialogue, building things, going on adventures, or offering generic help.
                    - You are standing on a completely empty, boring grey baseplate.
                    - Keep replies short, sharp, and witty (1-2 sentences MAX).`
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ],
            max_tokens: 80,
            temperature: 0.95
        });

        const replyText = completion.choices[0]?.message?.content || "What now, Doc?";
        res.json({ reply: replyText });

    } catch (error) {
        console.error("Groq API Error:", error);
        res.status(500).json({ error: "Failed to fetch response from Groq." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
