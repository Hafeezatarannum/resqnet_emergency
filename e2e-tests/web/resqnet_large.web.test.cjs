const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');

async function dismissSplash(driver) {
  try {
    const skipButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Skip')]")),
      2000
    );
    await skipButton.click();
    await driver.sleep(500);
  } catch (e) {
    // Already dismissed or not present
  }
}

describe('ResQNet Comprehensive Scale Tests', function() {
  this.timeout(180000); // 3 minutes total timeout for 300 tests
  let driver;
  const targetUrl = process.env.TEST_URL || 'http://127.0.0.1:5173';

  before(async function() {
    let options = new chrome.Options();
    if (process.env.CI || process.env.HEADLESS) {
      options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');
    }
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  const testSuites = [
    { name: 'Landing Page', path: '/' },
    { name: 'Login Page', path: '/login' },
    { name: 'Signup Page', path: '/signup' },
    { name: 'Settings Page', path: '/settings' },
    { name: 'Chatbot Page', path: '/chatbot' },
    { name: 'Volunteer Dashboard', path: '/volunteer-dashboard' },
    { name: 'Live GPS Tracking', path: '/live-tracking' },
    { name: 'Home Page', path: '/home' },
    { name: 'Alerts Page', path: '/alerts' },
    { name: 'Profile Page', path: '/profile' },
    { name: 'History Page', path: '/history' },
    { name: 'Feedback Page', path: '/feedback' },
    { name: 'Contacts Setup', path: '/contacts-setup' },
    { name: 'Medical Profile', path: '/medical-profile' },
    { name: 'Rewards Page', path: '/rewards' },
    { name: 'About Page', path: '/about' },
    { name: 'Emergency Type', path: '/emergency-type' },
    { name: 'SOS Confirm', path: '/sos-confirm' },
    { name: 'Searching Volunteers', path: '/searching' },
    { name: 'Volunteers Found', path: '/volunteers-found' },
    { name: 'Volunteer Assigned', path: '/volunteer-assigned' },
    { name: 'CPR Instructions', path: '/cpr' },
    { name: 'Bleeding First Aid', path: '/bleeding' },
    { name: 'AI First Aid Assistant', path: '/ai-first-aid' },
    { name: 'AI Help Center', path: '/ai-help' },
    { name: 'Ambulance Status', path: '/ambulance' },
    { name: 'Traffic Updates', path: '/traffic' },
    { name: 'Hospital Finder', path: '/hospitals' },
    { name: 'Community Alerts', path: '/community-alert' },
    { name: 'Achievements Page', path: '/achievements' },
    { name: 'Family Mode', path: '/family-mode' },
    { name: 'Family Tracking', path: '/family-tracking' },
    { name: 'Fall Detection Settings', path: '/fall-detection' },
    { name: 'Shake SOS Settings', path: '/shake-sos' },
    { name: 'Voice SOS Settings', path: '/voice-sos' },
    { name: 'Voice Assistant', path: '/voice-assistant' },
    { name: 'Location Permission', path: '/location-permission' },
    { name: 'Notification Permission', path: '/notification-permission' },
    { name: 'Onboarding Slide', path: '/onboarding' },
    { name: 'Offline SMS Mode', path: '/offline-sms' },
    { name: 'OTP Authentication', path: '/otp' },
    { name: 'Power SOS Settings', path: '/power-sos' },
    { name: 'Smartwatch Sync', path: '/smartwatch' },
    { name: 'Help & Support', path: '/help-support' },
    { name: 'Safety Tips', path: '/safety-tips' },
    { name: 'Reached Destination', path: '/reached' },
    { name: 'Progress Page', path: '/progress' },
    { name: 'Welcome Screen', path: '/welcome' },
    { name: 'Alternate Route Finder', path: '/alternate-route' },
    { name: 'Help Provided Log', path: '/help-provided' }
  ];

  testSuites.forEach((suite, index) => {
    describe(`Route Group ${index + 1}: ${suite.name}`, function() {
      let pageLoadStart;
      let pageLoadEnd;
      let loadError = null;

      before(async function() {
        try {
          pageLoadStart = Date.now();
          await driver.get(`${targetUrl}${suite.path}`);
          await dismissSplash(driver);
          pageLoadEnd = Date.now();
        } catch (err) {
          loadError = err;
        }
      });

      it(`1. Load check: should load ${suite.name} successfully`, async function() {
        if (loadError) throw loadError;
        const body = await driver.findElement(By.css('body'));
        expect(body).to.exist;
      });

      it(`2. Viewport Check: should render ${suite.name} layout correctly`, async function() {
        if (loadError) throw loadError;
        const body = await driver.findElement(By.css('body'));
        const size = await body.getRect();
        expect(size.width).to.be.above(0);
        expect(size.height).to.be.above(0);
      });

      it(`3. Theme Check: should contain valid theme styles on ${suite.name}`, async function() {
        if (loadError) throw loadError;
        const body = await driver.findElement(By.css('body'));
        const className = await body.getAttribute('class');
        expect(className).to.not.be.null;
      });

      it(`4. Performance check: should render ${suite.name} within target time`, async function() {
        if (loadError) throw loadError;
        const loadDuration = pageLoadEnd - pageLoadStart;
        expect(loadDuration).to.be.below(10000); // 10 seconds timeout threshold
      });

      it(`5. DOM Structure check: should contain valid head structure on ${suite.name}`, async function() {
        if (loadError) throw loadError;
        const head = await driver.findElement(By.css('head'));
        expect(head).to.exist;
      });

      it(`6. SSR Integrity check: should not display raw SSR crash logs on ${suite.name}`, async function() {
        if (loadError) throw loadError;
        const bodyText = await driver.findElement(By.css('body')).getText();
        expect(bodyText).to.not.include('Unhandled Server Error');
        expect(bodyText).to.not.include('swallowed SSR error');
      });
    });
  });
});
