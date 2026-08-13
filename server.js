const express = require("express");
const Groq = require("groq-sdk");

const app = express();
app.use(express.json());

// Initialize Groq API client (Uses GROQ_API_KEY from Render Environment Variables)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt in request body" });
    }

    // Request completion from Groq
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 150, // Physically prevents the AI from generating more than ~15 words
    });

    const reply = completion.choices[0]?.message?.content || "...";
    
    // Returns both 'response' and 'reply' keys so Roblox reads it correctly
    res.json({ response: reply, reply: reply });
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Render assigns dynamic ports via process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
