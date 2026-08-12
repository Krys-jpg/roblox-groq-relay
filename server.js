app.post("/chat", async (req, res) => {
    try {
        const userPrompt = req.body.prompt;

        const completion = await groq.chat.completions.create({
            // Specify the Groq model
            model: "llama-3.3-70b-versatile", 
            messages: [
                {
                    role: "system",
                    content: `You are Mika, a friendly NPC guide inside a Roblox game.
                    
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
            // Limits response length to prevent cut-offs in UI
            max_tokens: 100, 
            temperature: 0.7
        });

        const replyText = completion.choices[0]?.message?.content || "Hmm, I couldn't think of anything to say.";
        res.json({ reply: replyText });

    } catch (error) {
        console.error("Groq API Error:", error);
        res.status(500).json({ error: "Failed to fetch response from Groq." });
    }
});
