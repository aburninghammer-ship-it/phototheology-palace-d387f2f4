import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to get the user's first name for personalized interactions
 * Extracts the first word from display_name for a more personal touch
 * Falls back to username if display_name is not available
 */
export const useUserFirstName = () => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserFirstName = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, username')
          .eq('id', user.id)
          .single();

        if (profile?.display_name) {
          // Extract first name (first word before space)
          const extractedFirst = profile.display_name.trim().split(/\s+/)[0];
          if (extractedFirst && extractedFirst.length > 0) {
            setFirstName(extractedFirst);
            console.log('[useUserFirstName] Extracted first name:', extractedFirst);
          } else {
            setFirstName(profile.display_name);
          }
        } else if (profile?.username) {
          // Fallback to username if no display name
          setFirstName(profile.username);
        }
      } catch (error) {
        console.error('[useUserFirstName] Error fetching user name:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserFirstName();
  }, []);

  return { firstName, isLoading };
};

/**
 * Utility function to get first name from display_name or username
 * Use this in async contexts where a hook isn't appropriate
 */
export const getUserFirstName = async (): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, username')
      .eq('id', user.id)
      .single();

    if (profile?.display_name) {
      const extractedFirst = profile.display_name.trim().split(/\s+/)[0];
      return extractedFirst && extractedFirst.length > 0 ? extractedFirst : profile.display_name;
    }
    
    return profile?.username || null;
  } catch (error) {
    console.error('[getUserFirstName] Error:', error);
    return null;
  }
};
