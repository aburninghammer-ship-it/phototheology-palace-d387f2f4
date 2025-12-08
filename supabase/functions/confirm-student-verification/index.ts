import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { code } = await req.json();

    if (!code || typeof code !== 'string' || code.length !== 6) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Please enter a valid 6-digit verification code" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get pending verification for this user
    const { data: verification, error: fetchError } = await supabase
      .from("pending_student_verifications")
      .select("*")
      .eq("user_id", user.id)
      .is("verified_at", null)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (fetchError || !verification) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "No pending verification found. Please request a new verification code." 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Check attempt count (max 5 attempts)
    if (verification.attempts >= 5) {
      // Delete the verification to force restart
      await supabase
        .from("pending_student_verifications")
        .delete()
        .eq("id", verification.id);

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Too many failed attempts. Please request a new verification code." 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Increment attempt count
    await supabase
      .from("pending_student_verifications")
      .update({ attempts: verification.attempts + 1 })
      .eq("id", verification.id);

    // Verify the code
    if (verification.verification_code !== code) {
      const remainingAttempts = 4 - verification.attempts;
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Invalid verification code. ${remainingAttempts} attempts remaining.` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Code is valid! Mark as verified
    await supabase
      .from("pending_student_verifications")
      .update({ verified_at: new Date().toISOString() })
      .eq("id", verification.id);

    // Grant student status
    const studentExpiresAt = new Date();
    studentExpiresAt.setFullYear(studentExpiresAt.getFullYear() + 1);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        is_student: true,
        student_verified_at: new Date().toISOString(),
        student_expires_at: studentExpiresAt.toISOString(),
        subscription_status: 'active',
        subscription_tier: 'student',
      })
      .eq("id", user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      throw new Error('Failed to update student status');
    }

    console.log(`Student verified: ${user.id}, email: ${verification.edu_email}, expires at: ${studentExpiresAt}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Student status verified! Free access granted for 1 year.",
        expiresAt: studentExpiresAt.toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error confirming student verification:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Verification failed' 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
