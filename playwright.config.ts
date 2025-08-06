import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
   // {
     // name: 'chromium',
     // use: { ...devices['Desktop Chrome'] },
    //},
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // You can add WebKit if needed
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
