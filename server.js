local AffinityData = {} -- Stores [Player.UserId] = currentAffinityNumber

local function getPersonalityDirective(affinity: number): string
	if affinity >= 61 then
		return "Personality: You like the player now, though you tease them playfully. Be warm, supportive, and protective, but keep a hint of your original spark."
	elseif affinity >= 26 then
		return "Personality: You are starting to like the player, but you hate admitting it. Act flustered or grudgingly helpful, softening your usual mean comments."
	elseif affinity >= 0 then
		return "Personality: Sassy, sarcastic, and unimpressed. You don't trust the player yet and maintain a cold, guarded exterior."
	else
		return "Personality: Annoyed and hostile. Openly dismissive of the player."
	end
end

-- Example event trigger when player sends a message
local function processPlayerMessage(player: Player, playerText: string)
	local userId = player.UserId
	AffinityData[userId] = AffinityData[userId] or 0 -- Default starting value
	
	-- 1. Construct dynamic system prompt
	local personalityContext = getPersonalityDirective(AffinityData[userId])
	local fullPrompt = personalityContext .. "\nPlayer says: " .. playerText
	
	-- 2. Call your AI Relay Service here with fullPrompt...
	-- local reply = AIRelay:FetchResponse(fullPrompt)
	
	-- 3. Send response back to NpcChatBubble
end
