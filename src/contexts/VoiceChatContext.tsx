import React, { createContext, useContext, useState, useCallback } from 'react';

interface VoiceChatContextType {
  isVoiceChatActive: boolean;
  currentRoom: string | null;
  isMuted: boolean;
  joinVoiceChat: (roomId: string) => void;
  leaveVoiceChat: () => void;
  toggleMute: () => void;
}

const VoiceChatContext = createContext<VoiceChatContextType | undefined>(undefined);

export function VoiceChatProvider({ children }: { children: React.ReactNode }) {
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const joinVoiceChat = useCallback((roomId: string) => {
    setCurrentRoom(roomId);
    setIsVoiceChatActive(true);
  }, []);

  const leaveVoiceChat = useCallback(() => {
    setCurrentRoom(null);
    setIsVoiceChatActive(false);
    setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return (
    <VoiceChatContext.Provider
      value={{
        isVoiceChatActive,
        currentRoom,
        isMuted,
        joinVoiceChat,
        leaveVoiceChat,
        toggleMute,
      }}
    >
      {children}
    </VoiceChatContext.Provider>
  );
}

export function useVoiceChat() {
  const context = useContext(VoiceChatContext);
  if (!context) {
    throw new Error('useVoiceChat must be used within VoiceChatProvider');
  }
  return context;
}
