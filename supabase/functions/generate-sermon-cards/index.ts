import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      throw new Error("sessionId is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get session with outline
    const { data: session, error: sessionError } = await supabase
      .from("live_sermon_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      throw new Error("Session not found");
    }

    const outline = session.sermon_outline as Array<{
      text: string;
      passages: string[];
      rooms: string[];
    }>;

    if (!outline || outline.length === 0) {
      throw new Error("No sermon outline found");
    }

    // Build the prompt for constrained output
    const systemPrompt = `You are a Phototheology study assistant. Your role is STRICTLY LIMITED to:
1. Tagging sermon points with PT room codes (e.g., SR, CR, BL, PR)
2. Suggesting cross-reference verses
3. Posing reflection questions for the congregation
4. Noting sanctuary connections

YOU MUST NOT:
- Interpret or explain what the pastor means
- Make theological claims or assertions
- Add your own commentary or opinions
- Contradict or modify the sermon content

For each sermon point, generate 1-3 study cards. Each card should be one of:
- pt_tag: Which PT rooms apply to this point
- cross_reference: Related verses (not already mentioned)
- reflection: A question for personal reflection
- sanctuary: How this connects to sanctuary furniture/services

Respond with a JSON array of cards.`;

    const userPrompt = `Generate study cards for these sermon points:

${outline.map((point, i) => `
Point ${i + 1}: "${point.text}"
- Key Passages: ${point.passages.join(", ") || "none specified"}
- Suggested Rooms: ${point.rooms.join(", ") || "none specified"}
`).join("\n")}

Return a JSON array where each object has:
{
  "sermon_point": "brief point reference",
  "card_type": "pt_tag" | "cross_reference" | "reflection" | "sanctuary",
  "pt_rooms": ["room codes"],
  "floor_number": 1-8 or null,
  "cross_references": ["verse references"],
  "reflection_question": "question text or null",
  "sanctuary_connection": "connection text or null"
}`;

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI error:", errorText);
      throw new Error("Failed to generate cards from AI");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    let cards: any[] = [];
    try {
      // Extract JSON array from response (handle markdown code blocks)
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        cards = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("Parse error:", parseError, "Content:", content);
      throw new Error("Failed to parse AI response");
    }

    // Insert cards into database
    const cardsToInsert = cards.map((card, index) => ({
      session_id: sessionId,
      card_type: card.card_type || "pt_tag",
      sermon_point: card.sermon_point || "Study note",
      pt_rooms: card.pt_rooms || [],
      floor_number: card.floor_number || null,
      cross_references: card.cross_references || [],
      reflection_question: card.reflection_question || null,
      sanctuary_connection: card.sanctuary_connection || null,
      display_order: index,
    }));

    const { error: insertError } = await supabase
      .from("sermon_study_cards")
      .insert(cardsToInsert);

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to save cards");
    }

    return new Response(
      JSON.stringify({ success: true, cardsGenerated: cardsToInsert.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
