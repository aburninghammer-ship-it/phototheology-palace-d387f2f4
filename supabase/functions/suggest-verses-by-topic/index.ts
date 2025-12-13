import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, excludeVerses = [] } = await req.json();
    console.log('Suggesting verses for topic:', topic, 'excluding:', excludeVerses.length, 'verses');

    if (!topic) {
      throw new Error('Topic is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const excludeList = excludeVerses.length > 0 
      ? `\n\nCRITICAL: Do NOT suggest any of these verses that were already provided: ${excludeVerses.join(', ')}. Choose DIFFERENT verses on the same topic.`
      : '';

    const systemPrompt = `You are Jeeves, a Phototheology expert and Bible scholar. Your task is to suggest 5-10 key Bible verses on a given topic that would be excellent for memorization.

For each verse:
1. Choose verses that are clear, memorable, and theologically significant
2. Provide the KJV text
3. Include a brief reason why this verse is important for the topic
4. ALWAYS suggest DIFFERENT verses - never repeat previously suggested verses${excludeList}

Return your response in this exact JSON format:
{
  "verses": [
    {
      "reference": "John 3:16",
      "text": "For God so loved the world...",
      "reason": "Core gospel message about salvation"
    }
  ]
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Suggest 5-10 key Bible verses for memorization on the topic: "${topic}"` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received', JSON.stringify(data));

    let result;
    try {
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No content in AI response');
      }

      result = typeof content === 'string' ? JSON.parse(content) : content;

      if (!result.verses || !Array.isArray(result.verses)) {
        throw new Error('Invalid verses format in AI response');
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Failed to parse AI response');
    }
    console.log(`Generated ${result.verses.length} verse suggestions`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in suggest-verses-by-topic:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        verses: []
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});