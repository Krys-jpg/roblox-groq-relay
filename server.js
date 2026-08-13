// Store affinity data in memory (Note: This resets if the server restarts. Consider a database later.)
const AffinityData = {}; 

function getPersonalityDirective(affinity) {
    if (affinity >= 61) {
        return "Personality: You like the player now, though you tease them playfully. Be warm, supportive, and protective, but keep a hint of your original spark.";
    } else if (affinity >= 26) {
        return "Personality: You are starting to like the player, but you hate admitting it. Act flustered or grudgingly helpful, softening your usual mean comments.";
    } else if (affinity >= 0) {
        return "Personality: Sassy, sarcastic, and unimpressed. You don't trust the player yet and maintain a cold, guarded exterior.";
    } else {
        return "Personality: Annoyed and hostile. Openly dismissive of the player.";
    }
}

// Example endpoint/function to handle the incoming request from Roblox
function processPlayerMessage(userId, playerText) {
    // Initialize to 0 if the player doesn't exist in the object yet
    if (AffinityData[userId] === undefined) {
        AffinityData[userId] = 0;
    }
    
    // 1. Construct dynamic system prompt
    const personalityContext = getPersonalityDirective(AffinityData[userId]);
    const fullPrompt = `${personalityContext}\nPlayer says: ${playerText}`;
    
    // 2. Pass fullPrompt to your AI API (Groq) here...
    return fullPrompt;
}
