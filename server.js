const express = require('express');
const Groq = require('groq-sdk');

const app = express();
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/chat', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ reply: "No prompt provided." });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a friendly NPC inside a Roblox game. Keep your responses short, conversational, and under two sentences."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile"
        });

        const aiReply = completion.choices[0]?.message?.content || "I didn't catch that.";
        res.json({ reply: aiReply });

    } catch (error) {
        console.error("Groq API Error:", error);
        res.status(500).json({ reply: "Sorry, my brain went offline for a second!" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
