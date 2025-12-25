import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.98c05df24add45e2b847c58d111e8d6a',
  appName: 'phototheology-palace',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://98c05df2-4add-45e2-b847-c58d111e8d6a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0f0f1e',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0f0f1e'
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true
    }
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#0f0f1e'
  },
  android: {
    backgroundColor: '#0f0f1e',
    allowMixedContent: true
  }
};

export default config;
