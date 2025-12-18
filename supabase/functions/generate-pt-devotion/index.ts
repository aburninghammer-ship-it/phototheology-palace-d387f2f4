import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PTDevotionRequest {
  churchName: string;
  churchId: string;
  dayOfWeek: string;
  theme: string;
  ptRoom: string;
  ptFloor: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { churchName, dayOfWeek, theme, ptRoom, ptFloor } = await req.json() as PTDevotionRequest;
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a pastoral devotional writer using the Phototheology (PT) method. You write devotions that are biblically grounded, Christ-centered, and practically applicable.

PHOTOTHEOLOGY CONTEXT:
- PT Room: ${ptRoom} (${ptFloor})
- Today's Theme: ${theme}

PT ROOM DESCRIPTIONS:
- CR (Concentration Room): Christ-centered focus - every text reveals Christ
- DR (Dimensions Room): 5 dimensions - Literal, Christ, Me, Church, Heaven
- FRt (Fruit Room): Testing interpretation against Galatians 5:22-23 fruit
- MR (Meditation Room): Slow, deep engagement with Scripture
- PR (Prophecy Room): Prophetic timeline and fulfillment
- 3A (Three Angels Room): Revelation 14's final gospel messages
- BL (Blue/Sanctuary Room): Sanctuary blueprint patterns

CHURCH: ${churchName}
DAY: ${dayOfWeek}

DEVOTION REQUIREMENTS:
1. Ground the devotion in a specific Scripture passage
2. Apply the PT room's methodology to interpret the text
3. Include practical calls to:
   - MINISTRY: How to serve others today
   - RIGHTEOUSNESS: How to live holy in private and public
   - STUDY: A deeper study prompt for personal growth
   - PRAYER: Focused prayer points for ${churchName}

TONE:
- Pastoral but prophetic
- Warm but urgent
- Biblical realism, not sentimentality
- Address ${churchName} by name throughout

OUTPUT FORMAT (JSON):
{
  "title": "Compelling, identity-shaping title",
  "anchorScripture": "Book Chapter:Verse",
  "scriptureText": "Full verse text",
  "ptRoom": "${ptRoom}",
  "ptFloor": "${ptFloor}",
  "meditation": "3-4 paragraphs applying PT methodology to the Scripture, addressing ${churchName} directly. Show how this text reveals Christ and applies to scattered church life.",
  "ministryChallenge": "One specific, actionable ministry task for today",
  "righteousnessCall": "One specific call to holy living - private integrity, digital purity, relational faithfulness",
  "studyPrompt": "One deeper study question with cross-references for personal exploration",
  "prayerFocus": "4-6 line prayer addressing God on behalf of ${churchName}, plural (we/us), focused on the day's theme"
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate a ${dayOfWeek} devotion with the theme "${theme}" using the ${ptRoom} room methodology. Make it powerful, grounded in PT principles, and mission-focused for ${churchName}. Call members to ministry, righteous living, faithful study, and fervent prayer.` }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content generated');
    }

    let devotion;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      devotion = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Raw content:', content);
      throw new Error('Failed to parse devotion content');
    }

    return new Response(JSON.stringify({ devotion }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating PT devotion:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
