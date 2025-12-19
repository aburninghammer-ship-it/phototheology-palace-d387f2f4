import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EarlyHit {
  timestamp: number;
  session_id: string;
  page: string;
  referrer: string;
  user_agent: string;
  screen: string;
  viewport: string;
  is_mobile: boolean;
}

interface BounceData {
  session_id: string;
  page: string;
  time_on_page_ms: number;
  is_bounce: boolean;
  timestamp: number;
}

/**
 * Syncs early tracking data (captured before React mounted) to Supabase
 */
export const useSyncEarlyTracking = () => {
  useEffect(() => {
    const syncData = async () => {
      try {
        // Get early hits from sessionStorage
        const earlyHitsRaw = sessionStorage.getItem('pt_early_hits');
        const bouncesRaw = sessionStorage.getItem('pt_bounces');
        
        if (earlyHitsRaw) {
          const earlyHits: EarlyHit[] = JSON.parse(earlyHitsRaw);
          
          // Insert early page views
          for (const hit of earlyHits) {
            await supabase.from('page_views').insert({
              page_path: hit.page,
              referrer: hit.referrer === 'direct' ? null : hit.referrer,
              user_agent: hit.user_agent,
              created_at: new Date(hit.timestamp).toISOString(),
            });
          }
          
          // Clear synced data
          sessionStorage.removeItem('pt_early_hits');
        }
        
        if (bouncesRaw) {
          const bounces: BounceData[] = JSON.parse(bouncesRaw);
          
          // Insert bounce data
          for (const bounce of bounces) {
            await supabase.from('user_events').insert({
              event_type: bounce.is_bounce ? 'early_bounce' : 'page_exit',
              event_data: {
                session_id: bounce.session_id,
                page: bounce.page,
                time_on_page_ms: bounce.time_on_page_ms,
                is_bounce: bounce.is_bounce,
              },
              page_path: bounce.page,
              session_id: bounce.session_id,
            });
          }
          
          // Clear synced data
          sessionStorage.removeItem('pt_bounces');
        }
      } catch (error) {
        console.debug('[Early Tracking Sync] Error:', error);
      }
    };
    
    // Sync after a short delay to not block initial render
    const timeout = setTimeout(syncData, 2000);
    return () => clearTimeout(timeout);
  }, []);
};
