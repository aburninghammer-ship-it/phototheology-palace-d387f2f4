import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface GatehouseStatus {
  hasEnteredPalace: boolean;
  surfaceStudyOnly: boolean;
  palaceEnteredAt: string | null;
  isLoading: boolean;
}

export const useGatehouseStatus = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<GatehouseStatus>({
    hasEnteredPalace: false,
    surfaceStudyOnly: false,
    palaceEnteredAt: null,
    isLoading: true,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user) {
        setStatus(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('has_entered_palace, surface_study_only, palace_entered_at')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching gatehouse status:', error);
        setStatus(prev => ({ ...prev, isLoading: false }));
        return;
      }

      setStatus({
        hasEnteredPalace: data?.has_entered_palace || false,
        surfaceStudyOnly: data?.surface_study_only || false,
        palaceEnteredAt: data?.palace_entered_at || null,
        isLoading: false,
      });
    };

    fetchStatus();
  }, [user]);

  const markPalaceEntered = async () => {
    if (!user) return false;

    const { error } = await supabase
      .from('profiles')
      .update({
        has_entered_palace: true,
        palace_entered_at: new Date().toISOString(),
        surface_study_only: false,
      })
      .eq('id', user.id);

    if (!error) {
      setStatus(prev => ({
        ...prev,
        hasEnteredPalace: true,
        palaceEnteredAt: new Date().toISOString(),
        surfaceStudyOnly: false,
      }));
      return true;
    }
    return false;
  };

  const markSurfaceStudy = async () => {
    if (!user) return false;

    const { error } = await supabase
      .from('profiles')
      .update({
        surface_study_only: true,
        has_entered_palace: false,
      })
      .eq('id', user.id);

    if (!error) {
      setStatus(prev => ({
        ...prev,
        surfaceStudyOnly: true,
        hasEnteredPalace: false,
      }));
      return true;
    }
    return false;
  };

  return { ...status, markPalaceEntered, markSurfaceStudy };
};
