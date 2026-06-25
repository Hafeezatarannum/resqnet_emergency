const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');

async function dismissSplash(driver) {
  try {
    // Wait up to 3 seconds for the Skip button to appear if splash is showing
    const skipButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Skip')]")),
      3000
    );
    await skipButton.click();
    await driver.sleep(600); // Wait for transition
  } catch (e) {
    // Splash screen might not be present or already dismissed
  }
}

describe('Web Application E2E Test', function() {
  this.timeout(45000); // 45 seconds timeout
  let driver;
  const targetUrl = process.env.TEST_URL || 'http://127.0.0.1:5173';

  before(async function() {
    // Initialize Chrome driver
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

  it('should load the application successfully', async function() {
    await driver.get(targetUrl);
    
    // Wait until body is present (basic check)
    await driver.wait(until.elementLocated(By.css('body')), 5000);
    await dismissSplash(driver);
    
    const title = await driver.getTitle();
    console.log('Page title:', title);
    
    expect(title).to.not.be.empty;
  });

  it('should have a header element', async function() {
    const headerElement = await driver.findElement(By.css('header'));
    expect(headerElement).to.exist;
  });
  
  it('should navigate to the login page', async function() {
    // Go to login page
    await driver.get(`${targetUrl}/login`);
    await dismissSplash(driver);
    
    // Wait for a form element, an input, or a button. 
    const emailInput = await driver.wait(until.elementLocated(By.css('input[type="email"], input[name="email"], input[placeholder*="Email"]')), 10000);
    
    expect(emailInput).to.exist;
    
    const passwordInput = await driver.findElement(By.css('input[type="password"]'));
    expect(passwordInput).to.exist;
    
    // Test inputting text
    await emailInput.sendKeys('testuser@example.com');
    await passwordInput.sendKeys('password123');
    
    const emailValue = await emailInput.getAttribute('value');
    expect(emailValue).to.equal('testuser@example.com');
  });
});
