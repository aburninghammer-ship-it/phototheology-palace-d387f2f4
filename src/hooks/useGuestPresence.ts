import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GuestPresenceState {
  guestCount: number;
  guests: Array<{ id: string; displayName: string; groupName?: string }>;
}

export function useGuestPresence(eventId: string, guestId: string, displayName: string) {
  const [presenceState, setPresenceState] = useState<GuestPresenceState>({
    guestCount: 0,
    guests: []
  });

  useEffect(() => {
    const channel = supabase.channel(`presence-${eventId}`, {
      config: { presence: { key: guestId } }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const guests = Object.entries(state).map(([key, value]) => ({
          id: key,
          displayName: (value as any)[0]?.displayName || 'Guest',
          groupName: (value as any)[0]?.groupName
        }));
        
        setPresenceState({
          guestCount: guests.length,
          guests
        });
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('Guest joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('Guest left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            displayName,
            online_at: new Date().toISOString()
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, guestId, displayName]);

  return presenceState;
}
