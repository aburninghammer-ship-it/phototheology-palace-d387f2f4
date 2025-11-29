import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { SimpleVoiceRoom } from './SimpleVoiceRoom';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

interface VoiceChatWidgetProps {
  roomType: 'palace' | 'bible' | 'deck' | 'games' | 'challenges' | 'battle' | 'study';
  roomId: string;
  roomName?: string;
  className?: string;
}

export function VoiceChatWidget({ roomType, roomId, roomName, className }: VoiceChatWidgetProps) {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('User');
  const fullRoomId = `${roomType}-${roomId}`;

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('display_name, username')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setDisplayName(data.display_name || data.username || 'User');
        }
      }
    };
    fetchProfile();
  }, [user]);

  if (!user) return null;

  return (
    <SimpleVoiceRoom
      roomId={fullRoomId}
      userId={user.id}
      userName={displayName}
      className={className}
    />
  );
}
