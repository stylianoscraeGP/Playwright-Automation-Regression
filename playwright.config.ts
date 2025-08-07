import { defineConfig, devices } from '@playwright/test';

const browserstackUsername = process.env.BROWSERSTACK_USERNAME;
const browserstackAccessKey = process.env.BROWSERSTACK_ACCESS_KEY;

export default defineConfig({
  testDir: './RegressionAutomation',  // your test folder
  projects: [
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },  // local Firefox
    },
    {
      name: 'bs-chrome-win',
      use: {
        browserName: 'chromium',
        // Connect to BrowserStack remote browser via WebSocket endpoint
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
            JSON.stringify({
              browser: 'chrome',
              browser_version: 'latest',
              os: 'Windows',
              os_version: '10',
              name: 'Playwright test on BrowserStack',
              build: 'build-1',
              'browserstack.username': browserstackUsername,
              'browserstack.accessKey': browserstackAccessKey,
            })
          )}`,
        },
      },
    },
  ],
  reporter: [['list'], ['html']],
  use: {
    headless: true,
    screenshot: 'on',
    video: 'on',
    launchOptions:{
      devtools: true,
    }
  },
});
