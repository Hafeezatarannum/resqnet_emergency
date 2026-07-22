import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.resqnet.app',
  appName: 'ResQNet',
  webDir: 'dist/client',
  server: {
    url: 'http://10.42.138.26:5173',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
