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
    const { content, title } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!content || content.trim().length < 20) {
      // Return original content if too short
      return new Response(JSON.stringify({ formattedContent: content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are a Bible study document formatter. Your task is to take raw study notes and format them beautifully using HTML while preserving EVERY SINGLE WORD the user wrote.

CRITICAL RULES:
1. NEVER change, remove, add, or rephrase ANY of the user's words
2. NEVER add your own commentary or content
3. ONLY add HTML formatting tags to improve visual presentation
4. Preserve all user content exactly as written

FORMATTING GUIDELINES:
- Wrap main sections in <h2> or <h3> tags
- Use <strong> for emphasis on key terms like book names, Christ, God, Scripture references
- Use <blockquote> for Scripture quotes or important insights
- Use <ul> and <li> for lists
- Use <p> tags for paragraphs with proper spacing
- Use <em> for subtle emphasis
- Add <hr> between major sections if appropriate
- Keep headings that start with # or ## and convert them to <h2>/<h3>
- Scripture references like "John 3:16" or "Genesis 1:1" should be in <strong>
- Palace room codes (OR, CR, IR, DR, etc.) should be in <strong> with a subtle highlight

OUTPUT: Return ONLY the formatted HTML content, no explanations.`;

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
          { role: "user", content: `Title: ${title || "Untitled Study"}\n\nContent to format:\n${content}` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limited");
        return new Response(JSON.stringify({ formattedContent: content, error: "Rate limited" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ formattedContent: content, error: "AI error" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const formattedContent = data.choices?.[0]?.message?.content || content;

    return new Response(JSON.stringify({ formattedContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in format-study-content:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
