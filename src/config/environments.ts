export const ENV = {
  API_BASE_URL: process.env.API_BASE_URL || 'https://reqres.in',
  REQRES_API_KEY: process.env.REQRES_API_KEY || '',
  E2E_BASE_URL: process.env.E2E_BASE_URL || 'https://www.saucedemo.com',
  HEADLESS: process.env.HEADLESS !== 'false',
  SLOW_MO: parseInt(process.env.SLOW_MO || '0', 10),
  TIMEOUT: parseInt(process.env.TIMEOUT || '30000', 10),
};
