// Notification sound and vibration utility
let audioContext: AudioContext | null = null;

// Create a simple notification beep using Web Audio API
const playNotificationBeep = () => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Create a pleasant notification tone (two quick beeps)
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);

    // Second beep
    setTimeout(() => {
      const oscillator2 = audioContext!.createOscillator();
      const gainNode2 = audioContext!.createGain();

      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext!.destination);

      oscillator2.frequency.value = 1000;
      oscillator2.type = 'sine';

      gainNode2.gain.setValueAtTime(0.3, audioContext!.currentTime);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext!.currentTime + 0.1);

      oscillator2.start(audioContext!.currentTime);
      oscillator2.stop(audioContext!.currentTime + 0.1);
    }, 120);
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

// Vibrate device (mobile)
const vibrateDevice = () => {
  try {
    if ('vibrate' in navigator) {
      // Two short vibrations: [duration, pause, duration]
      navigator.vibrate([100, 50, 100]);
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

// Main function to play notification
export const playMessageNotification = () => {
  if (isSoundEnabled()) {
    playNotificationBeep();
  }
  
  if (isVibrationEnabled()) {
    vibrateDevice();
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
