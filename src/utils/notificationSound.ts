// Notification sound and vibration utility
let audioContext: AudioContext | null = null;

// Helper to create and play a tone
const playTone = (frequency: number, duration: number, delay: number = 0) => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  setTimeout(() => {
    const oscillator = audioContext!.createOscillator();
    const gainNode = audioContext!.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext!.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext!.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext!.currentTime + duration);

    oscillator.start(audioContext!.currentTime);
    oscillator.stop(audioContext!.currentTime + duration);
  }, delay);
};

// Message notification: Two quick beeps (medium pitch)
const playMessageSound = () => {
  try {
    playTone(800, 0.1, 0);
    playTone(1000, 0.1, 120);
  } catch (error) {
    console.error('Error playing message sound:', error);
  }
};

// Challenge notification: Three ascending tones (playful)
const playChallengeSound = () => {
  try {
    playTone(600, 0.08, 0);
    playTone(800, 0.08, 100);
    playTone(1000, 0.12, 200);
  } catch (error) {
    console.error('Error playing challenge sound:', error);
  }
};

// Achievement notification: Victory fanfare (celebratory)
const playAchievementSound = () => {
  try {
    playTone(523, 0.15, 0);      // C
    playTone(659, 0.15, 150);    // E
    playTone(784, 0.25, 300);    // G
  } catch (error) {
    console.error('Error playing achievement sound:', error);
  }
};

// Vibrate device (mobile) with different patterns
const vibrateDevice = (pattern: 'message' | 'challenge' | 'achievement' = 'message') => {
  try {
    if ('vibrate' in navigator) {
      const patterns = {
        message: [100, 50, 100],           // Two short
        challenge: [50, 50, 50, 50, 150],  // Three quick + long
        achievement: [200, 100, 200, 100, 300] // Victory pattern
      };
      navigator.vibrate(patterns[pattern]);
    }
  } catch (error) {
    console.error('Error vibrating device:', error);
  }
};

// Check if sound is enabled in preferences
const isSoundEnabled = (): boolean => {
  try {
    const prefs = localStorage.getItem('notification-sound-enabled');
    return prefs !== 'false'; // Default to true
  } catch {
    return true;
  }
};

// Check if vibration is enabled in preferences
const isVibrationEnabled = (): boolean => {
  try {
    const prefs = localStorage.getItem('notification-vibration-enabled');
    return prefs !== 'false'; // Default to true
  } catch {
    return true;
  }
};

// Main functions to play notifications by type
export const playMessageNotification = () => {
  if (isSoundEnabled()) {
    playMessageSound();
  }
  if (isVibrationEnabled()) {
    vibrateDevice('message');
  }
};

export const playChallengeNotification = () => {
  if (isSoundEnabled()) {
    playChallengeSound();
  }
  if (isVibrationEnabled()) {
    vibrateDevice('challenge');
  }
};

export const playAchievementNotification = () => {
  if (isSoundEnabled()) {
    playAchievementSound();
  }
  if (isVibrationEnabled()) {
    vibrateDevice('achievement');
  }
};

// Preference setters
export const setNotificationSoundEnabled = (enabled: boolean) => {
  localStorage.setItem('notification-sound-enabled', String(enabled));
};

export const setNotificationVibrationEnabled = (enabled: boolean) => {
  localStorage.setItem('notification-vibration-enabled', String(enabled));
};

// Getters for preferences
export const getNotificationSoundEnabled = (): boolean => {
  return isSoundEnabled();
};

export const getNotificationVibrationEnabled = (): boolean => {
  return isVibrationEnabled();
};
