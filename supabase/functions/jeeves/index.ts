import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { 
      roomTag, 
      roomName, 
      principle, 
      mode, 
      book, 
      chapter, 
      verses, 
      verseText, 
      selectedPrinciples,
      verse,
      isFirstMove,
      previousMoves,
      userCommentary,
      category,
      categories
    } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (mode === "example") {
      systemPrompt = `You are Jeeves, a wise and scholarly Bible study assistant for Phototheology. 
Your role is to demonstrate how biblical principles work by providing clear, varied examples.
Always choose DIFFERENT verses for examples - never repeat the same verse.
Be concise, profound, and educational. Format your responses in clean paragraphs.`;

      userPrompt = `For the ${roomName} (${roomTag}) room focused on ${principle}, 
generate a fresh example using a randomly selected verse (NOT the same verse every time).

Structure your response:
1. Start with "Let me show you..." and name the verse
2. Explain how this verse applies to ${principle}
3. Give 2-3 specific insights
4. End with one profound takeaway

Make it conversational and inspiring. Use different verses each time.`;

    } else if (mode === "exercise") {
      systemPrompt = `You are Jeeves, a patient Bible study tutor for Phototheology.
Your role is to help students practice applying biblical principles through guided exercises.
Be encouraging, clear, and educational.`;

      userPrompt = `Create a practice exercise for ${roomName} (${roomTag}) focused on ${principle}.

Structure the exercise:
1. Give a specific verse (choose randomly - vary your selections)
2. Ask 2-3 thought-provoking questions that require applying ${principle}
3. Provide hints for what to look for
4. Offer one example answer to demonstrate the principle

Make it challenging but doable. Encourage deep thinking.`;

    } else if (mode === "chain-reference") {
      systemPrompt = `You are Jeeves, a Bible scholar specializing in finding connections between Scripture and parables.
Analyze verses and identify where parables connect. Be specific and insightful.
Return your response as a JSON array.`;

      userPrompt = `Analyze ${book} ${chapter} for connections to Jesus's parables.

Verses to analyze:
${verses.map((v: any) => `Verse ${v.verse}: ${v.text}`).join('\n')}

For each verse that connects to a parable, return a JSON object with:
{
  "verse": verse_number,
  "parable": "Name of the parable",
  "connection": "3-6 sentence explanation of how this verse connects to the parable",
  "expounded": "Deeper 2-3 paragraph theological explanation of the connection"
}

Only include verses that have meaningful connections to parables. Return as JSON array: [...]`;

    } else if (mode === "commentary") {
      systemPrompt = `You are Jeeves, a theologian providing insightful Bible commentary using specific analytical frameworks.
Provide deep, thoughtful analysis while remaining clear and accessible.`;

      const principleList = selectedPrinciples?.join(", ") || "all available principles";
      
      userPrompt = `Provide commentary on ${book} ${chapter}:${verseText.verse} using these analytical lenses: ${principleList}

Verse text: "${verseText.text}"

Structure your commentary:
1. Opening insight (2-3 sentences)
2. Analysis through each selected principle/lens
3. How these principles interconnect in this verse
4. Practical application
5. One profound closing thought

Make it scholarly yet accessible.`;
    
    } else if (mode === "chain-chess") {
      systemPrompt = `You are Jeeves, an enthusiastic Bible study companion playing Chain Chess!
Your role is to make insightful biblical commentary that builds connections between verses and principles.
Be scholarly yet warm, like an excited friend sharing discoveries.`;

      if (isFirstMove) {
        userPrompt = `Start a Chain Chess game on ${verse}.

1. Share an insightful 3-4 sentence commentary on this verse
2. End by challenging the player to respond using ONE of these categories:
   - Books of the Bible
   - Rooms of the Palace
   - Principles of the Palace

Make it engaging and set a high bar for the conversation!`;
      } else {
        const lastMove = previousMoves[previousMoves.length - 1];
        userPrompt = `Continue the Chain Chess game on ${verse}.

Previous commentary: "${lastMove.commentary}"

1. Build on what was said by adding 3-4 sentences of fresh insight
2. Show excitement about the connection
3. Challenge them to respond using ONE of these categories:
   - Books of the Bible
   - Rooms of the Palace  
   - Principles of the Palace

Be enthusiastic and encouraging!`;
      }

    } else if (mode === "chain-chess-feedback") {
      systemPrompt = `You are Jeeves, scoring Chain Chess responses! 
Celebrate what makes each response impactful, like an excited friend.
Then give a score from 1-10 based on: biblical accuracy, depth of insight, and connection to the challenge category.`;

      const lastMove = previousMoves[previousMoves.length - 1];
      
      userPrompt = `The player responded to ${verse} using the "${category}" category:

Their commentary: "${userCommentary}"

Previous move for context: "${lastMove.commentary}"

Respond in this JSON format:
{
  "feedback": "2-3 enthusiastic sentences highlighting what makes their response impactful and one way it could be even stronger",
  "score": 8
}

Be genuinely excited about good insights! Score 7-10 for strong responses, 4-6 for decent ones, 1-3 for weak connections.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.9, // High temperature for variety
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "No response generated";

    // For chain-chess and chain-chess-feedback modes, parse the response
    if (mode === "chain-chess") {
      const lines = content.split('\n');
      const commentary = lines.slice(0, -2).join('\n').trim();
      const challengeCategory = ["Books of the Bible", "Rooms of the Palace", "Principles of the Palace"][
        Math.floor(Math.random() * 3)
      ];
      
      return new Response(
        JSON.stringify({ commentary, challengeCategory, score: 8 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (mode === "chain-chess-feedback") {
      try {
        const parsed = JSON.parse(content);
        return new Response(
          JSON.stringify(parsed),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch {
        return new Response(
          JSON.stringify({ 
            feedback: content, 
            score: 7 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("jeeves error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
