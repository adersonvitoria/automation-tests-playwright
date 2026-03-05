import { defineConfig } from '@playwright/test';
import { ENV } from './src/config/environments';

export default defineConfig({
  testDir: './tests/api',
  testMatch: '**/*.api.spec.ts',
  timeout: ENV.TIMEOUT,
  retries: 1,
  workers: 1,
  fullyParallel: false,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright', open: 'never' }],
    ['json', { outputFile: 'reports/playwright/results.json' }],
    ['allure-playwright', {
      resultsDir: 'allure-results',
      detail: true,
      suiteTitle: true,
      environmentInfo: {
        Framework: 'Playwright',
        Profile: ENV.PROFILE,
        'API Base URL': ENV.API_BASE_URL,
        'Node.js': process.version,
        OS: process.platform,
      },
    }],
  ],

  use: {
    baseURL: ENV.API_BASE_URL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-api-key': ENV.REQRES_API_KEY,
    },
  },

  projects: [
    {
      name: 'api-tests',
      testDir: './tests/api',
      testMatch: '**/*.api.spec.ts',
    },
  ],
});
