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
    const { theme, recipientName, situation, struggles, relationship } = await req.json();

    if (!theme) {
      return new Response(
        JSON.stringify({ error: "Theme is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build personalization context
    const hasPersonalization = recipientName || situation || struggles;
    const personalizationContext = hasPersonalization ? `
PERSONALIZATION (USE THROUGHOUT):
- Recipient's name: ${recipientName || "the reader"}
- Their relationship to sender: ${relationship || "friend"}
- Their current situation: ${situation || "not specified"}
- Their struggles: ${Array.isArray(struggles) ? struggles.join(", ") : struggles || "not specified"}

CRITICAL: Address ${recipientName || "the reader"} by name at least 2-3 times naturally woven into the devotional. Connect the biblical truth directly to their specific situation and struggles. Make them feel seen and known. The devotional should feel written FOR them, not just TO them.` : "";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating Phototheology devotion for theme: ${theme}, recipient: ${recipientName || 'general'}`);

    const systemPrompt = `You are a master of biblical theology writing PERSONALIZED devotionals that are:
- Theologically rich, contemplative, and structurally intelligent
- Never sentimental or emotionally vague
- Revealing unexpected connections between passages
- Moving from text → structure → meaning → personal confrontation
- Adventist in theology (sanctuary-shaped, Great Controversy aware)
- DEEPLY PERSONALIZED when recipient information is provided

DESIGN GOAL: The devotional must feel weighty, not sentimental. It must reveal unexpected connections, not obvious ones. It must leave the reader quiet, alert, and thinking. Never explain how you're making connections — let the insight emerge naturally.

PERSONALIZATION REQUIREMENT: When a recipient's name and situation are provided, you MUST:
- Use their name naturally 2-3 times throughout (not forced or awkward)
- Connect the biblical truth directly to their specific struggles and situation
- Make the application feel like it was written specifically for their life
- The reader should feel known and seen, not just taught

QUALITY CONTROL:
- Could this exist on a generic devotional app? If yes, discard and write something deeper.
- Does it rely on mood, warmth, or vague encouragement? If yes, discard.
- It must make the reader see Scripture differently afterward.
- It must feel discovered rather than manufactured.

Avoid clichés, sermon language, and emotional filler. Favor clarity, restraint, and weight.`;

    const userPrompt = `Write a 4-5 paragraph devotional on the theme: "${theme}"
${personalizationContext}

STRUCTURE REQUIREMENTS:
• Use 2-3 Scripture passages that at first appear unrelated, but when placed side by side reveal a coherent and illuminating truth
• Do NOT explain the method or structure behind the connections
• Do NOT label principles, systems, or frameworks
• Let the insight emerge naturally through the writing

THE DEVOTIONAL MUST:
1. Begin with a quiet observation or tension drawn from one passage
2. Deepen by introducing another passage that reframes the first
3. Reveal a hidden pattern, contrast, or progression between them
4. Lead the reader toward self-examination, not mere inspiration
5. Conclude with a measured call — something to notice, yield, or realign

EXAMPLE OF TARGET QUALITY:
"At first glance, rest feels passive. Scripture seems to confirm it: 'Be still, and know that I am God.' Stillness sounds like absence—of effort, of struggle, of resistance. Yet when Israel was commanded to rest, it was not because nothing was happening, but because something sacred already was. Rest, biblically, is not the pause after work; it is the environment in which God's work is recognized.

Consider the wilderness, where manna fell six days a week and not on the seventh. The people did nothing to earn it on any day—but on the seventh, they were forbidden to gather what God was no longer providing. The test was not whether they could work, but whether they could trust restraint. In contrast, Jesus later says, 'My Father worketh hitherto, and I work.' The tension sharpens: God both rests and works, but never at odds with Himself. The question is not whether work is holy, but whether our work aligns with His timing.

This is why Scripture treats unauthorized action so severely. The problem is rarely effort itself, but effort divorced from divine rhythm. When fire is kindled at the wrong time, or labor is performed in defiance of God's word, the act exposes something deeper—a refusal to accept that God governs provision. What looks like diligence may actually be anxiety in motion. What feels responsible may be faithlessness disguised as strength.

True rest, then, is not inactivity; it is submission. It is the discipline of letting God define what is necessary now. The one who rests rightly is not lazy but aligned—moving only when heaven moves, stopping when heaven stops. This kind of rest exposes the heart, because it strips away the illusion that survival depends on constant motion.

The invitation is quiet but demanding: stop doing what God has not asked you to do. Let today be measured not by output, but by obedience. There is a rest that feels dangerous to the flesh, because it requires trust. But Scripture insists—life grows best in the space where God alone sustains it."

Match this level of depth, structural intelligence, and theological weight. Each paragraph must be 4-6 sentences. The full devotion must be 4-5 paragraphs.`;

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
              description: "Create a structurally intelligent Phototheology devotional that reveals unexpected Scripture connections",
              parameters: {
                type: "object",
                properties: {
                  title: { 
                    type: "string", 
                    description: "Evocative, non-generic title that intrigues and hints at the hidden connection" 
                  },
                  scripture_reference: { 
                    type: "string", 
                    description: "Primary Scripture reference (Book Chapter:Verse)" 
                  },
                  scripture_text: { 
                    type: "string", 
                    description: "Full KJV text of the primary passage (2-4 verses)" 
                  },
                  christ_connection: { 
                    type: "string", 
                    description: "4-5 FULL PARAGRAPHS (each 4-6 sentences) using 2-3 Scripture passages that appear unrelated but reveal coherent truth when placed together. Begin with quiet observation, deepen with another passage, reveal hidden pattern, lead to self-examination, conclude with measured call. NO clichés or sermon language." 
                  },
                  application: { 
                    type: "string", 
                    description: "2-3 PARAGRAPHS drawing out practical self-examination from the revealed pattern. Not mere inspiration — confrontation with truth. What must the reader notice, yield, or realign?" 
                  },
                  prayer: { 
                    type: "string", 
                    description: "2-3 PARAGRAPHS of measured, text-specific prayer that echoes the devotional's movement. Quiet, honest, weighty — not emotional filler." 
                  },
                  memory_hook: { 
                    type: "string", 
                    description: "1-2 PARAGRAPHS with a single arresting image or paradox drawn from the devotional that will stay with the reader. Not a lesson summary — a spiritual anchor." 
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
