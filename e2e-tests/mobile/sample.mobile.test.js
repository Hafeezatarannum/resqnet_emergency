const { remote } = require('webdriverio');
const { expect } = require('chai');
const path = require('path');

describe('Mobile Application E2E Test (Appium)', function() {
  this.timeout(60000); // 60 seconds timeout for Appium setup
  let driver;

  before(async function() {
    // Determine the path to the APK
    const apkPath = path.resolve(__dirname, '../../android/app/build/outputs/apk/debug/app-debug.apk');

    const capabilities = {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:app': apkPath,
      'appium:ensureWebviewsHavePages': true,
      'appium:nativeWebScreenshot': true,
      'appium:newCommandTimeout': 3600,
      'appium:connectHardwareKeyboard': true
    };

    const wdOpts = {
      hostname: process.env.APPIUM_HOST || 'localhost',
      port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
      logLevel: 'info',
      capabilities,
    };

    try {
      driver = await remote(wdOpts);
    } catch (e) {
      console.error('Failed to connect to Appium. Make sure the Appium server is running and an emulator is available.', e);
      throw e;
    }
  });

  after(async function() {
    if (driver) {
      await driver.deleteSession();
    }
  });

  it('should launch the mobile app successfully', async function() {
    // Wait for the app to load
    // Note: The specific elements to wait for will depend on your Capacitor app's splash screen and initial UI.
    // For a webview-based app, you might need to switch context:
    const contexts = await driver.getContexts();
    console.log('Available contexts:', contexts);
    
    // Attempt to switch to webview if available
    const webviewContext = contexts.find(c => c.includes('WEBVIEW'));
    if (webviewContext) {
      await driver.switchContext(webviewContext);
      
      // Basic check if we are in the webview
      const title = await driver.getTitle();
      console.log('Webview title:', title);
      expect(title).to.not.be.undefined;
    } else {
      console.log('No webview found, running in native context.');
      // For purely native apps, or before the webview is fully ready, check for native elements
      // Example: wait for a generic Android View to appear
      const el = await driver.$('//android.view.View');
      const exists = await el.isExisting();
      expect(exists).to.be.true;
    }
  });
});
