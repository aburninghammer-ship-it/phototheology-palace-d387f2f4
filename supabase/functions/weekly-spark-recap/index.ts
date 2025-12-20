import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Get sparks from the last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data: sparks, error: sparksError } = await supabase
      .from('sparks')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', weekAgo.toISOString())
      .order('created_at', { ascending: false });

    if (sparksError) throw sparksError;

    if (!sparks || sparks.length === 0) {
      return new Response(JSON.stringify({ 
        recap: null,
        message: 'No sparks this week yet. Keep studying!'
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Get spark events for engagement metrics
    const sparkIds = sparks.map(s => s.id);
    const { data: events } = await supabase
      .from('spark_events')
      .select('spark_id, event_type')
      .in('spark_id', sparkIds);

    // Calculate metrics
    const totalSparks = sparks.length;
    const openedSparks = sparks.filter(s => s.opened_at).length;
    const savedSparks = sparks.filter(s => s.saved_at).length;
    const exploredCount = events?.filter(e => e.event_type === 'explored').length || 0;
    
    const sparkTypes: Record<string, number> = sparks.reduce((acc, s) => {
      acc[s.spark_type] = (acc[s.spark_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedTypes = Object.entries(sparkTypes)
      .sort((a, b) => (b[1] as number) - (a[1] as number));
    const dominantType = sortedTypes[0]?.[0] || 'connection';

    // Get top 3 sparks by confidence
    const topSparks = sparks
      .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
      .slice(0, 3)
      .map(s => ({
        title: s.title,
        type: s.spark_type,
        recognition: s.recognition,
        saved: !!s.saved_at
      }));

    // Generate AI recap if we have enough sparks
    let aiSummary = null;
    if (sparks.length >= 3) {
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      if (LOVABLE_API_KEY) {
        try {
          const sparkSummary = sparks.slice(0, 10).map(s => 
            `- ${s.title}: ${s.insight.substring(0, 200)}`
          ).join('\n');

          const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash',
              messages: [{
                role: 'user',
                content: `Based on these discovery sparks from a Bible student's week of study, write a brief, encouraging 2-3 sentence summary of themes emerging in their study and one gentle suggestion for next week. Be warm and scholarly. No markdown.

Sparks:
${sparkSummary}`
              }],
              temperature: 0.7,
            }),
          });

          if (response.ok) {
            const aiData = await response.json();
            aiSummary = aiData.choices[0]?.message?.content;
          }
        } catch (err) {
          console.error('AI summary error:', err);
        }
      }
    }

    const recap = {
      period: {
        start: weekAgo.toISOString(),
        end: new Date().toISOString()
      },
      metrics: {
        total: totalSparks,
        opened: openedSparks,
        saved: savedSparks,
        explored: exploredCount,
        engagementRate: totalSparks > 0 ? Math.round((openedSparks / totalSparks) * 100) : 0
      },
      dominantType,
      sparkTypes,
      topSparks,
      aiSummary
    };

    return new Response(JSON.stringify({ recap }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating recap:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate recap' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
