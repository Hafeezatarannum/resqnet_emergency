const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');

describe('Web Application E2E Test', function() {
  this.timeout(45000); // 45 seconds timeout
  let driver;
  const targetUrl = process.env.TEST_URL || 'http://localhost:5173';

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
    
    const title = await driver.getTitle();
    console.log('Page title:', title);
    
    // You can add more specific assertions here based on your app's content
    expect(title).to.not.be.empty;
  });

  it('should have a root element', async function() {
    const rootElement = await driver.findElement(By.id('root'));
    expect(rootElement).to.exist;
  });
  
  it('should navigate to the login page', async function() {
    // Go to login page
    await driver.get(`${targetUrl}/login`);
    
    // Wait for a form element, an input, or a button. 
    // Most standard login forms will have an input of type 'email' or a generic text input for username
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
