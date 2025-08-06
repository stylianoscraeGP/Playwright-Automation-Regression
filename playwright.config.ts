import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './RegressionAutomation',  // your test folder
  projects: [
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },  // run tests only on Firefox
    },
  ],
  reporter: [['list'], ['html']],
  use: {
    headless: false,
    screenshot: 'on',
    video: 'on',
    launchOptions:{
      devtools: true,  // enable devtools for debugging
    }
  },
});
