import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        await supabase.from('page_views').insert({
          user_id: user?.id || null,
          page_path: location.pathname,
          page_title: document.title,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        });
      } catch (error) {
        // Silently fail - don't interrupt user experience
        console.debug('Page tracking error:', error);
      }
    };

    trackPageView();
  }, [location.pathname]);
};

export const trackJeevesInteraction = async (
  question: string,
  featureUsed: string,
  responsePreview?: string,
  pageContext?: string
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from('jeeves_interactions').insert({
      user_id: user?.id || null,
      question: question.substring(0, 1000), // Limit length
      feature_used: featureUsed,
      response_preview: responsePreview?.substring(0, 500) || null,
      page_context: pageContext || null,
    });
  } catch (error) {
    console.debug('Jeeves tracking error:', error);
  }
};
