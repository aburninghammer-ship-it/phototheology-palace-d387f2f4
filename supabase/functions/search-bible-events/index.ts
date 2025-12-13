import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { events, excludeReferences = [] } = await req.json();
    
    if (!events || events.length === 0) {
      return new Response(
        JSON.stringify({ error: "At least one event is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const eventList = events.join(", ");
    const excludeNote = excludeReferences.length > 0 
      ? `\n\nIMPORTANT: Do NOT include these verses as they were already shown: ${excludeReferences.join(", ")}`
      : "";

    const systemPrompt = `You are a Bible scholar specializing in finding scripture passages related to biblical events and stories.
Given a list of biblical events/stories, find the most relevant Bible verses (KJV) that describe or reference those events.

Return a JSON array with 5-8 results. Each result should have:
- reference: The Bible reference (e.g., "Genesis 3:6")
- text: The actual verse text from KJV
- event_name: Which event this relates to
- summary: A brief one-sentence explanation of how this verse connects to the event

Focus on verses that directly describe the event or are key moments in the story.
Only return valid JSON array, no markdown or explanation.`;

    const userPrompt = `Find key Bible verses (KJV) related to these biblical events/stories: ${eventList}${excludeNote}

Return only a JSON array like:
[{"reference": "Genesis 3:6", "text": "And when the woman saw...", "event_name": "The Fall", "summary": "The moment Eve took the forbidden fruit"}]`;

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
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";
    
    // Parse the JSON response
    let results = [];
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.replace(/```json?\n?/g, "").replace(/```$/g, "").trim();
      }
      results = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      results = [];
    }

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Event search error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
