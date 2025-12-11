import { useCallback, useRef, useEffect } from "react";

// Simple synthesized sounds using Web Audio API for zero latency
const createAudioContext = () => {
  if (typeof window !== "undefined") {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return null;
};

let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = createAudioContext();
  }
  return audioContext;
};

// Resume audio context on user interaction (required by browsers)
const resumeAudioContext = async () => {
  const ctx = getAudioContext();
  if (ctx && ctx.state === "suspended") {
    await ctx.resume();
  }
};

type SoundType = "click" | "tab" | "success" | "error" | "toggle";

const playSound = (type: SoundType, volume = 0.3) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  resumeAudioContext();

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  const now = ctx.currentTime;

  switch (type) {
    case "click":
      // Short, subtle click - high frequency blip
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, now);
      oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.05);
      gainNode.gain.setValueAtTime(volume * 0.4, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      oscillator.start(now);
      oscillator.stop(now + 0.08);
      break;

    case "tab":
      // Soft tab switch - slightly lower, smoother
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(600, now);
      oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.06);
      gainNode.gain.setValueAtTime(volume * 0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
      break;

    case "success":
      // Pleasant ascending chime
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(523, now); // C5
      oscillator.frequency.setValueAtTime(659, now + 0.1); // E5
      oscillator.frequency.setValueAtTime(784, now + 0.2); // G5
      gainNode.gain.setValueAtTime(volume * 0.5, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      oscillator.start(now);
      oscillator.stop(now + 0.35);
      break;

    case "error":
      // Low warning tone
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(200, now);
      oscillator.frequency.setValueAtTime(150, now + 0.1);
      gainNode.gain.setValueAtTime(volume * 0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      oscillator.start(now);
      oscillator.stop(now + 0.2);
      break;

    case "toggle":
      // Quick toggle pop
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(1000, now);
      oscillator.frequency.exponentialRampToValueAtTime(500, now + 0.04);
      gainNode.gain.setValueAtTime(volume * 0.35, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      oscillator.start(now);
      oscillator.stop(now + 0.06);
      break;
  }
};

export const useSoundEffects = () => {
  const isEnabled = useRef(true);

  // Check localStorage for sound preference
  useEffect(() => {
    const stored = localStorage.getItem("soundEffectsEnabled");
    if (stored !== null) {
      isEnabled.current = stored === "true";
    }
  }, []);

  const play = useCallback((type: SoundType, volume?: number) => {
    if (isEnabled.current) {
      playSound(type, volume);
    }
  }, []);

  const toggle = useCallback(() => {
    isEnabled.current = !isEnabled.current;
    localStorage.setItem("soundEffectsEnabled", String(isEnabled.current));
    return isEnabled.current;
  }, []);

  return { play, toggle, isEnabled: isEnabled.current };
};

// Export standalone play function for use without hook
export { playSound };
