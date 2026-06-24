const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');

describe('Web Application E2E Test', function() {
  this.timeout(30000); // 30 seconds timeout
  let driver;

  before(async function() {
    // Initialize Chrome driver
    let options = new chrome.Options();
    if (process.env.CI) {
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

  it('should load the home page successfully', async function() {
    // Replace with your actual development server URL if different
    const targetUrl = 'http://localhost:5173';
    
    await driver.get(targetUrl);
    
    // Wait until body is present (basic check)
    await driver.wait(until.elementLocated(By.css('body')), 5000);
    
    const title = await driver.getTitle();
    console.log('Page title:', title);
    
    // You can add more specific assertions here based on your app's content
    expect(title).to.not.be.empty;
  });

  it('should find a root element', async function() {
    const rootElement = await driver.findElement(By.id('root'));
    expect(rootElement).to.exist;
  });
});
