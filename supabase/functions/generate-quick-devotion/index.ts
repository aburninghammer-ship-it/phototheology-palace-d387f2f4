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

    console.log(`Generating Phototheology devotion for theme: ${theme}`);

    const systemPrompt = `You are Jeeves, a Phototheology devotional writer. Create Christ-centered, biblically grounded devotionals that are:
- Fresh, imaginative, and spiritually piercing
- Adventist in theology (sanctuary-shaped, Great Controversy aware)
- Free from clichés and shallow moralism
- Revealing hidden connections in Scripture

CRITICAL: Each section must be SUBSTANTIAL - multiple sentences with deep theological insight and vivid imagery.`;

    const userPrompt = `Create a rich Phototheology devotion on: "${theme}"

REQUIREMENTS FOR EACH FIELD:
1. title: An evocative, non-generic title that intrigues
2. scripture_reference: Book Chapter:Verse(s) - e.g., "Psalm 46:10"
3. scripture_text: The FULL KJV text of 2-4 verses
4. christ_connection: 3-4 FULL SENTENCES explaining how Christ is specifically revealed in this text. Show the Christological depth, connect to His work, character, or mission.
5. application: 3-4 FULL SENTENCES with practical, heart-transforming application. Not generic moralism, but rooted in the specific insight. Address real struggles with real wisdom.
6. memory_hook: A VIVID, EXTENDED METAPHOR or mental image (3-4 sentences) that helps remember the insight. Paint a picture - use sensory details, describe a scene, make it unforgettable.
7. prayer: 3-4 FULL SENTENCES of heartfelt, text-specific prayer. Not generic - address God with the specific truths revealed in this devotion.

EXAMPLE QUALITY for application:
"In our own workplace struggles, where injustice or inefficiency test our spirit, the call is not to passive resignation but to active, trusting rest. Rather than reacting in anger or striving to control outcomes beyond our purview, we are invited to anchor our souls in God's ultimate sovereignty, allowing His divine rhythm to guide our responses."

EXAMPLE QUALITY for memory_hook:
"Imagine a master weaver, meticulously interweaving threads of various colors and textures. From your perspective, some threads seem out of place, even chaotic. But the weaver sees the whole design, knowing that each thread, even the seemingly discordant ones, contributes to the breathtaking final tapestry. Your work situation is but a few threads in His grand design."

EXAMPLE QUALITY for prayer:
"Heavenly Father, grant us the grace to release the grip of anxiety and the urge to fix what You alone can mend. Imbue us with the quiet confidence of Christ, that we may rest in Your unfailing wisdom as we navigate the challenges of our daily work, trusting in Your perfect timing and ultimate justice. Amen."

Match this level of depth and substance in EVERY field.`;

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
              description: "Create a structured Phototheology devotional with substantial, multi-sentence content in each field",
              parameters: {
                type: "object",
                properties: {
                  title: { 
                    type: "string", 
                    description: "Evocative, non-generic title that intrigues" 
                  },
                  scripture_reference: { 
                    type: "string", 
                    description: "Book Chapter:Verse(s) format" 
                  },
                  scripture_text: { 
                    type: "string", 
                    description: "Full KJV text of 2-4 verses" 
                  },
                  christ_connection: { 
                    type: "string", 
                    description: "3-4 full sentences explaining how Christ is revealed in this text with theological depth" 
                  },
                  application: { 
                    type: "string", 
                    description: "3-4 full sentences of practical, heart-transforming application rooted in the insight" 
                  },
                  prayer: { 
                    type: "string", 
                    description: "3-4 full sentences of heartfelt, text-specific prayer" 
                  },
                  memory_hook: { 
                    type: "string", 
                    description: "3-4 sentence vivid, extended metaphor or mental image with sensory details" 
                  },
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
    console.log("AI response received");
    
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
