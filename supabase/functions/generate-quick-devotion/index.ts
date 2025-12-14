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
    const { theme } = await req.json();

    if (!theme) {
      return new Response(
        JSON.stringify({ error: "Theme is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating quick devotion for theme: ${theme}`);

    const systemPrompt = `You are Jeeves, a Phototheology devotional writer. Create Christ-centered, biblically grounded devotionals that are:
- Fresh, imaginative, and spiritually piercing
- Adventist in theology (sanctuary-shaped, Great Controversy aware)
- Free from clichés and shallow moralism
- Revealing hidden connections in Scripture`;

    const userPrompt = `Create a devotion on: "${theme}"

Include:
1. An evocative title
2. A relevant Scripture (reference + full KJV text, 2-4 verses)
3. How Christ is revealed in this text (2-3 sentences)
4. A practical application rooted in the insight (2-3 sentences)
5. A closing prayer (2-3 sentences)
6. A memory hook - a vivid mental image to remember the insight`;

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
        tools: [
          {
            type: "function",
            function: {
              name: "create_devotion",
              description: "Create a structured devotional",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Evocative, non-generic title" },
                  scripture_reference: { type: "string", description: "Book Chapter:Verse(s)" },
                  scripture_text: { type: "string", description: "Full KJV text of the verses" },
                  christ_connection: { type: "string", description: "How Christ is revealed in this text" },
                  application: { type: "string", description: "Practical application rooted in the insight" },
                  prayer: { type: "string", description: "A closing prayer" },
                  memory_hook: { type: "string", description: "A vivid mental image to remember the insight" },
                },
                required: ["title", "scripture_reference", "scripture_text", "christ_connection", "application", "prayer", "memory_hook"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_devotion" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("AI response received:", JSON.stringify(data).slice(0, 500));
    
    // Extract from tool call
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      // Fallback to content parsing if tool call not present
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const devotion = JSON.parse(jsonMatch[0]);
          console.log("Successfully generated devotion (from content):", devotion.title);
          return new Response(JSON.stringify(devotion), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
      throw new Error("No valid response from AI");
    }

    const devotion = JSON.parse(toolCall.function.arguments);
    console.log("Successfully generated devotion:", devotion.title);

    return new Response(JSON.stringify(devotion), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-quick-devotion:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate devotion";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
