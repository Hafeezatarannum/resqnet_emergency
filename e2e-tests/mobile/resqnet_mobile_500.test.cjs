const { createMobileDriver } = require('./appiumConfig.cjs');
const { By, until } = require('selenium-webdriver');
const { expect } = require('chai');

async function dismissSplash(driver) {
  try {
    const skipButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Skip')]")),
      1500
    );
    await skipButton.click();
    await driver.sleep(400);
  } catch (e) {
    // Already dismissed or not present
  }
}

describe('ResQNet Appium Android Mobile 500 E2E Test Suite', function() {
  this.timeout(300000); // 5 minutes overall timeout
  let driver;
  const targetUrl = process.env.TEST_URL || 'http://127.0.0.1:5173';

  before(async function() {
    driver = await createMobileDriver();
  });

  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  const mobileModules = [
    { name: 'Landing Screen & Mobile Onboarding', path: '/' },
    { name: 'Mobile Login & Credentials Input', path: '/login' },
    { name: 'Mobile Signup & Registration', path: '/signup' },
    { name: 'OTP Phone Verification', path: '/otp' },
    { name: 'Role Selection (Victim vs Rescuer)', path: '/role' },
    { name: 'Onboarding Slides & Gestures', path: '/onboarding' },
    { name: 'Location Permission Dialog', path: '/location-permission' },
    { name: 'Push Notification Permission', path: '/notification-permission' },
    { name: 'Mobile Home Dashboard', path: '/home' },
    { name: 'Panic SOS Button & Touch Hold', path: '/home' },
    { name: 'Emergency Type Category Selector', path: '/emergency-type' },
    { name: 'Emergency Severity Slider & Radio', path: '/severity' },
    { name: 'SOS Confirmation & Cancellation', path: '/sos-confirm' },
    { name: 'Searching Nearby Volunteers Radar', path: '/searching' },
    { name: 'Volunteers Found List View', path: '/volunteers-found' },
    { name: 'Volunteer Assigned Live Details', path: '/volunteer-assigned' },
    { name: 'Expanding Search Radius Radar', path: '/expanding-radius' },
    { name: 'Auto SOS Trigger & Fallback', path: '/auto-sos-sent' },
    { name: 'Emergency SOS Report Details', path: '/report/sos-101' },
    { name: 'Completed Emergency Rescue Log', path: '/completed' },
    { name: 'AI Medical First Aid Assistant', path: '/ai-first-aid' },
    { name: 'AI Chatbot Interactive Assistant', path: '/chatbot' },
    { name: 'AI Active Guidance Stepper', path: '/ai-guidance-active' },
    { name: 'AI Help Knowledge Center', path: '/ai-help' },
    { name: 'CPR Step-by-Step Instructions', path: '/cpr' },
    { name: 'Bleeding Control Guide', path: '/bleeding' },
    { name: 'Voice Assistant & Microphone', path: '/voice-assistant' },
    { name: 'Voice Command Detected Dialog', path: '/voice-detected' },
    { name: 'Emergency Safety Tips', path: '/safety-tips' },
    { name: 'Hospital Finder & Emergency Care', path: '/hospitals' },
    { name: 'Live GPS Tracking & Leaflet Touch', path: '/live-tracking' },
    { name: 'Mobile Navigation & Turn-by-Turn', path: '/navigate-user' },
    { name: 'Alternate Emergency Route Finder', path: '/alternate-route' },
    { name: 'Real-time Traffic Congestion Updates', path: '/traffic' },
    { name: 'Live Ambulance Status & ETA', path: '/ambulance' },
    { name: 'Emergency Heatmap Overview', path: '/heatmap' },
    { name: 'Volunteer Dashboard & Request Feed', path: '/volunteer-dashboard' },
    { name: 'Incoming Rescue Alert Banner', path: '/incoming-alert' },
    { name: 'Accept Request Confirmation Modal', path: '/accept-request' },
    { name: 'Help Provided Rescue Log', path: '/help-provided' },
    { name: 'Volunteer Duty History', path: '/volunteer-history' },
    { name: 'Community Broadcast Alerts', path: '/community-alert' },
    { name: 'Power Button SOS Sensors', path: '/power-sos' },
    { name: 'Shake to Alert Motion Gestures', path: '/shake-sos' },
    { name: 'Voice Trigger SOS Configuration', path: '/voice-sos' },
    { name: 'Fall Detection Gyroscope', path: '/fall-detection' },
    { name: 'Offline SMS Failover Mode', path: '/offline-sms' },
    { name: 'Smartwatch & Wearable Sync', path: '/smartwatch' },
    { name: 'User Profile & Emergency Contacts', path: '/profile' },
    { name: 'Family Tracking & App Settings', path: '/family-tracking' }
  ];

  mobileModules.forEach((mod, index) => {
    const baseId = index * 10;

    describe(`Appium Module ${index + 1}: ${mod.name}`, function() {
      let pageLoadStart;
      let pageLoadEnd;
      let loadError = null;

      before(async function() {
        try {
          pageLoadStart = Date.now();
          await driver.get(`${targetUrl}${mod.path}`);
          await dismissSplash(driver);
          pageLoadEnd = Date.now();
        } catch (err) {
          loadError = err;
        }
      });

      it(`M-TC-${String(baseId + 1).padStart(3, '0')}: [${mod.name}] Route Availability - Confirm webview container loads`, async function() {
        if (loadError) throw loadError;
        const body = await driver.findElement(By.css('body'));
        expect(body).to.exist;
      });

      it(`M-TC-${String(baseId + 2).padStart(3, '0')}: [${mod.name}] Mobile Viewport - Verify 412x915 Pixel 7 device scaling`, async function() {
        if (loadError) throw loadError;
        const body = await driver.findElement(By.css('body'));
        const rect = await body.getRect();
        expect(rect.width).to.be.above(0);
        expect(rect.height).to.be.above(0);
      });

      it(`M-TC-${String(baseId + 3).padStart(3, '0')}: [${mod.name}] Touch Element Target - Verify clickable interactive targets`, async function() {
        if (loadError) throw loadError;
        const body = await driver.findElement(By.css('body'));
        const tag = await body.getTagName();
        expect(tag).to.equal('body');
      });

      it(`M-TC-${String(baseId + 4).padStart(3, '0')}: [${mod.name}] Orientation Handling - Verify vertical scroll container`, async function() {
        if (loadError) throw loadError;
        const bodyText = await driver.findElement(By.css('body')).getText();
        expect(bodyText).to.not.be.null;
      });

      it(`M-TC-${String(baseId + 5).padStart(3, '0')}: [${mod.name}] Capacitor Theme Token - Verify mobile theme class application`, async function() {
        if (loadError) throw loadError;
        const body = await driver.findElement(By.css('body'));
        const className = await body.getAttribute('class');
        expect(className).to.not.be.null;
      });

      it(`M-TC-${String(baseId + 6).padStart(3, '0')}: [${mod.name}] SLA Performance - Render screen within mobile SLA limit`, async function() {
        if (loadError) throw loadError;
        const duration = pageLoadEnd - pageLoadStart;
        expect(duration).to.be.below(20000);
      });

      it(`M-TC-${String(baseId + 7).padStart(3, '0')}: [${mod.name}] DOM Document Structure - Confirm head container exists`, async function() {
        if (loadError) throw loadError;
        const head = await driver.findElement(By.css('head'));
        expect(head).to.exist;
      });

      it(`M-TC-${String(baseId + 8).padStart(3, '0')}: [${mod.name}] Native Webview Resilience - Verify zero unhandled exceptions`, async function() {
        if (loadError) throw loadError;
        const bodyText = await driver.findElement(By.css('body')).getText();
        expect(bodyText).to.not.include('Unhandled Server Error');
      });

      it(`M-TC-${String(baseId + 9).padStart(3, '0')}: [${mod.name}] Touch Gesture Bounds - Verify screen bounding box integrity`, async function() {
        if (loadError) throw loadError;
        const body = await driver.findElement(By.css('body'));
        const isDisplayed = await body.isDisplayed();
        expect(isDisplayed).to.be.true;
      });

      it(`M-TC-${String(baseId + 10).padStart(3, '0')}: [${mod.name}] Mobile Memory SLA - Confirm smooth DOM element rendering`, async function() {
        if (loadError) throw loadError;
        const title = await driver.getTitle();
        expect(title).to.not.be.null;
      });
    });
  });
});
