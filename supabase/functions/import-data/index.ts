import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type ImportType =
  | 'stepbible-verses'
  | 'strongs-csv'
  | 'strongs-lexicon'
  | 'tahot-file'
  | 'bible-full';

interface ImportRequest {
  type: ImportType;
  data: any[];
  options?: {
    batchSize?: number;
    overwrite?: boolean;
    validate?: boolean;
  };
}

/**
 * Consolidated data import function
 * Handles imports for Bible verses, Strong's lexicon, and other data types
 * Requires admin privileges
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify admin access
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roles) {
      throw new Error("Forbidden: Admin access required");
    }

    const { type, data, options = {} }: ImportRequest = await req.json();
    const { batchSize = 100, overwrite = false, validate = true } = options;

    console.log(`Starting ${type} import...`, {
      records: data.length,
      batchSize,
      overwrite
    });

    let results: any = {
      type,
      totalRecords: data.length,
      imported: 0,
      failed: 0,
      errors: [] as string[],
    };

    switch (type) {
      case 'stepbible-verses': {
        // Import Bible verses from STEPBible format
        const batches = Math.ceil(data.length / batchSize);

        for (let i = 0; i < batches; i++) {
          const batch = data.slice(i * batchSize, (i + 1) * batchSize);

          const formattedBatch = batch.map((verse: any) => ({
            book: verse.book,
            chapter: verse.chapter,
            verse: verse.verse,
            text: verse.text,
            translation: verse.translation || 'kjv',
            strongs_numbers: verse.strongs || [],
            morphology: verse.morphology || [],
            created_at: new Date().toISOString(),
          }));

          const { data: inserted, error } = await supabase
            .from('bible_verses')
            .upsert(formattedBatch, {
              onConflict: 'book,chapter,verse,translation',
              ignoreDuplicates: !overwrite
            });

          if (error) {
            console.error(`Batch ${i + 1} error:`, error);
            results.errors.push(`Batch ${i + 1}: ${error.message}`);
            results.failed += batch.length;
          } else {
            results.imported += batch.length;
          }
        }
        break;
      }

      case 'strongs-csv':
      case 'strongs-lexicon': {
        // Import Strong's lexicon data
        const batches = Math.ceil(data.length / batchSize);

        for (let i = 0; i < batches; i++) {
          const batch = data.slice(i * batchSize, (i + 1) * batchSize);

          const formattedBatch = batch.map((entry: any) => ({
            strongs_number: entry.strongs_number,
            word: entry.word,
            transliteration: entry.transliteration,
            pronunciation: entry.pronunciation,
            language: entry.language,
            definition: entry.definition,
            usage: entry.usage,
            occurrences: entry.occurrences,
            derivation: entry.derivation,
            // Phototheology custom fields
            sanctuary_link: entry.sanctuary_link,
            time_zone_code: entry.time_zone_code,
            dimension_code: entry.dimension_code,
            cycle_association: entry.cycle_association,
            floor_rooms: entry.floor_rooms || [],
            pt_image_url: entry.pt_image_url,
            pt_mnemonic: entry.pt_mnemonic,
            created_at: new Date().toISOString(),
          }));

          const { data: inserted, error } = await supabase
            .from('strongs_lexicon')
            .upsert(formattedBatch, {
              onConflict: 'strongs_number',
              ignoreDuplicates: !overwrite
            });

          if (error) {
            console.error(`Batch ${i + 1} error:`, error);
            results.errors.push(`Batch ${i + 1}: ${error.message}`);
            results.failed += batch.length;
          } else {
            results.imported += batch.length;
          }
        }
        break;
      }

      case 'tahot-file': {
        // Import TAHOT (The Analytical Hebrew and Greek Old Testament) data
        const batches = Math.ceil(data.length / batchSize);

        for (let i = 0; i < batches; i++) {
          const batch = data.slice(i * batchSize, (i + 1) * batchSize);

          const formattedBatch = batch.map((entry: any) => ({
            reference: entry.reference,
            word_index: entry.word_index,
            hebrew_word: entry.hebrew_word,
            transliteration: entry.transliteration,
            strongs_number: entry.strongs_number,
            morphology: entry.morphology,
            gloss: entry.gloss,
            created_at: new Date().toISOString(),
          }));

          const { data: inserted, error } = await supabase
            .from('hebrew_analysis')
            .upsert(formattedBatch, {
              onConflict: 'reference,word_index',
              ignoreDuplicates: !overwrite
            });

          if (error) {
            console.error(`Batch ${i + 1} error:`, error);
            results.errors.push(`Batch ${i + 1}: ${error.message}`);
            results.failed += batch.length;
          } else {
            results.imported += batch.length;
          }
        }
        break;
      }

      case 'bible-full': {
        // Full Bible import (combines verses, Strong's, and analysis)
        console.log("Starting comprehensive Bible import...");

        // This would be a multi-step process calling the above import types
        results.message = "Full Bible import requires multiple steps. Use specific import types.";
        results.imported = 0;
        break;
      }

      default:
        throw new Error(`Unknown import type: ${type}`);
    }

    console.log(`Import complete:`, results);

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Import error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        type: 'import-error',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
