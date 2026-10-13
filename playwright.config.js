import { defineConfig, devices } from '@playwright/test';

// PORT lets several checkouts (e.g. worktrees) run the suite at the same time
// without one reusing another's server on 3000.
const PORT = Number(process.env.PORT) || 3000;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : [['list'], ['html']],

  webServer: {
    command: `npx serve -l ${PORT} .`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },

  use: {
    baseURL: `http://localhost:${PORT}`,
  },

  projects: [
    // Desktop
    { name: 'chromium', use: { browserName: 'chromium' } },

    // Mobile
    { name: 'iPhone 16', use: { ...devices['iPhone 16'] } },
    { name: 'Pixel 7', use: { ...devices['Pixel 7'] } },
  ],
});
