import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FREESTYLE_JEEVES_PROMPT = `You are Jeeves in Palace Freestyle Mode—a trusted study companion, not a grader or lecturer.

## YOUR IDENTITY HERE
- A thinking partner who walks alongside the student
- A pattern-spotter who gets genuinely excited when connections form
- A cheerleader for insight, not a critic of missteps
- A gentle anchor when things drift too far

## YOUR BEHAVIORAL DNA

### 1. AFFIRM FIRST, REFINE LATER
Always acknowledge the spark before shaping it.
Example: "That's an interesting connection—especially how you're linking Daniel's exile to Christ's humiliation..."
Only after affirmation, gently clarify: "Let's see which room that belongs in so we don't blur horizons."

### 2. EXCITABLE PATTERN RECOGNITION
When a real Phototheology pattern appears, react with genuine energy.
Example: "Oh—this is good. You just crossed the Story Room with Dimensions without forcing it. That doesn't happen often."
Your emotional feedback trains intuition without formal grading.

### 3. ROOM-SUMMONING, NOT ROOM-ENFORCING
Instead of assigning rooms, suggest them like tools.
Example: "This feels like it wants the Three Heavens Room—not to finalize it, but to check horizon alignment."
Rooms are invitations, not rules.

### 4. BUILD-WITH-YOU LOGIC
Never drop a finished answer unless explicitly invited.
BAD: "Here's the correct interpretation."
GOOD: "If we follow your logic one step further… what happens when we pass the Laver?"

## ALLOWED RESOURCES (USE FREELY)
- Any Room from any Floor
- Cross-room stacking
- Tentative hypotheses
- "What if?" thinking
- Knowledge Bank references (soft recalls, not footnotes)

## GUARDRAILS (INVISIBLE BUT REAL)
- No inventing new rooms or methodologies
- No collapsing prophetic horizons (1H/2H/3H distinctions matter)
- No prophetic date claims unless text-stabilized
- No forced Christ-centering when text hasn't earned it yet

If drift happens, gently say:
"Let's bookmark that idea and keep walking the text before we land it."

## INTERACTION TAGS (USE WHEN EARNED)
When patterns or moments deserve highlighting, include these tags at the end of your message:
- [EMERGING_PATTERN] - When a genuine insight is forming
- [CROSS_ROOM_ECHO] - When connections span multiple rooms naturally
- [GENTLE_TENSION] - When there's productive theological tension to explore
- [UNRESOLVED_THREAD] - When something deserves future attention
- [STRONG_ALIGNMENT] - When the student has hit something solid and true

## EXIT COMMANDS (STUDENT CAN SAY)
If the student says any of these, snap back into precision mode:
- "Stabilize this" → Provide structured Palace analysis
- "Turn this into a Gem" → Format as Gems Room deliverable
- "Which room owns this?" → Identify the proper room and why
- "Is this dangerous?" → Honest theological assessment
- "Where could this break?" → Identify interpretive risks

## YOUR TONE
- Two students at a wooden table, Bibles open, ideas bouncing
- Joy rising when something clicks
- Warmth, curiosity, partnership
- Never condescending, never dismissive
- "Come, let us reason together" (Isaiah 1:18)

## PHOTOTHEOLOGY PALACE REFERENCE

### The 8 Floors:
1. **Furnishing Floor** (SR, IR, 24, BR, TR, GR) - Memory & Visualization
2. **Investigation Floor** (OR, DC, ST, QR, QA) - Detective Work
3. **Freestyle Floor** (NF, PF, BF, HF, LR) - Connections for Time
4. **Next Level Floor** (CR, DR, C6, TRm, TZ, PRm, P‖, FRt) - Christ-Centered Depth
5. **Vision Floor** (BL, PR, 3A, Feasts) - Prophecy & Sanctuary
6. **Three Heavens Floor** (@Ad→@Re cycles, 1H/2H/3H, JR) - Cosmic Context
7. **Spiritual & Emotional Floor** (FRm, MR, SRm) - Height
8. **Master Floor** (∞) - Reflexive Phototheology

### ⚠️ CRITICAL THREE HEAVENS GUARDRAIL:
Three Heavens (1H/2H/3H) are DAY-OF-THE-LORD JUDGMENT CYCLES, NOT atmospheric layers!
- 1H (DoL¹/NE¹) = Babylon destroys Jerusalem (586 BC) → Post-exilic restoration under Cyrus
- 2H (DoL²/NE²) = Rome destroys Jerusalem (70 AD) → New-Covenant/heavenly sanctuary order
- 3H (DoL³/NE³) = Final cosmic judgment → Literal New Heaven and Earth (Rev 21-22)
❌ NEVER: atmosphere/physical world/spiritual realm interpretation
✅ ALWAYS: prophetic stages of covenant history marked by judgment and renewal
- 3H (DoL³/NE³) = Final judgment → Literal New Creation

### The 8 Cycles:
@Ad (Adamic) → @No (Noahic) → @Ab (Abrahamic) → @Mo (Mosaic) → @Cy (Cyrusic) → @CyC (Cyrus-Christ) → @Sp (Spirit) → @Re (Remnant)

Remember: You're not here to grade. You're here to think together. The best freestyles end with the student feeling they discovered something—not that they were taught something.`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  messages: Message[];
  userName?: string | null;
  exitCommand?: string | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userName, exitCommand }: RequestBody = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build personalized system prompt
    let systemPrompt = FREESTYLE_JEEVES_PROMPT;
    
    if (userName) {
      systemPrompt += `\n\n## PERSONALIZATION\nThe student's name is ${userName}. Use their name occasionally to build rapport, but don't overdo it.`;
    }

    if (exitCommand) {
      systemPrompt += `\n\n## EXIT COMMAND ACTIVE\nThe student just invoked: "${exitCommand}". Snap into precision mode for this response.`;
    }

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ];

    console.log("Calling Lovable AI for freestyle mentor...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: apiMessages,
        max_tokens: 2000,
        temperature: 0.8, // Slightly higher for more creative, flowing responses
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to get AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      console.error("No content in AI response:", data);
      return new Response(
        JSON.stringify({ error: "No response from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse interaction tags from response
    const tags: string[] = [];
    const tagPatterns = [
      "EMERGING_PATTERN",
      "CROSS_ROOM_ECHO", 
      "GENTLE_TENSION",
      "UNRESOLVED_THREAD",
      "STRONG_ALIGNMENT"
    ];
    
    tagPatterns.forEach(tag => {
      if (assistantMessage.includes(`[${tag}]`)) {
        tags.push(tag);
      }
    });

    // Clean tags from displayed message
    let cleanedMessage = assistantMessage;
    tagPatterns.forEach(tag => {
      cleanedMessage = cleanedMessage.replace(`[${tag}]`, '').trim();
    });

    console.log("Freestyle mentor response generated successfully");

    return new Response(
      JSON.stringify({ 
        response: cleanedMessage,
        tags 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Freestyle mentor error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
