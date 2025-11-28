import { supabase } from "@/integrations/supabase/client";
import { trackJeevesInteraction } from "@/hooks/useAnalyticsTracking";

interface JeevesRequest {
  mode: string;
  message?: string;
  [key: string]: unknown;
}

interface JeevesResponse {
  data: unknown;
  error: Error | null;
}

/**
 * Wrapper for Jeeves function calls that automatically tracks interactions
 */
export const callJeeves = async (
  body: JeevesRequest,
  pageContext?: string
): Promise<JeevesResponse> => {
  const { data, error } = await supabase.functions.invoke("jeeves", { body });
  
  // Track the interaction asynchronously (don't block the response)
  const question = body.message || body.mode || "unknown";
  const featureUsed = body.mode || "unknown";
  const responsePreview = typeof data === "string" 
    ? data.substring(0, 200) 
    : data?.response?.substring(0, 200) || null;
  
  trackJeevesInteraction(question, featureUsed, responsePreview, pageContext);
  
  return { data, error };
};
