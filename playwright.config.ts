import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests/api',
  testMatch: '**/*.api.spec.ts',
  timeout: 30_000,
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
        'API Base URL': 'https://reqres.in',
        'Node.js': process.version,
        OS: process.platform,
      },
    }],
  ],

  use: {
    baseURL: 'https://reqres.in',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-api-key': process.env.REQRES_API_KEY || '',
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
