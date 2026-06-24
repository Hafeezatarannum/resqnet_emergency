import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.resqnet.app',
  appName: 'ResQNet',
  webDir: 'dist/client',
  server: {
    url: 'https://resqnet-emergency.platform-needhelpers.workers.dev/?v=3',
    cleartext: true
  }
};

export default config;
