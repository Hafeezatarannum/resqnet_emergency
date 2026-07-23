const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

/**
 * Appium / WebdriverIO Android Mobile Driver Configuration
 * ResQNet Mobile App Package: com.resqnet.app
 * App Activity: .MainActivity
 */
const getAppiumCapabilities = () => {
  return {
    platformName: 'Android',
    'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Android Emulator',
    'appium:automationName': 'UiAutomator2',
    'appium:appPackage': 'com.resqnet.app',
    'appium:appActivity': '.MainActivity',
    'appium:noReset': false,
    'appium:fullReset': false,
    'appium:newCommandTimeout': 120
  };
};

async function createMobileDriver() {
  let options = new chrome.Options();
  // Set mobile emulation parameters (Pixel 7 viewport emulation)
  options.setMobileEmulation({
    deviceMetrics: { width: 412, height: 915, pixelRatio: 2.6 },
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7 Build/UQ1A.240105.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 Appium/UiAutomator2'
  });

  if (process.env.CI || process.env.HEADLESS) {
    options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');
  }

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  return driver;
}

module.exports = {
  getAppiumCapabilities,
  createMobileDriver
};
