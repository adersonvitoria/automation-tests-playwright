import 'dotenv/config';

type Profile = 'dev' | 'stg' | 'prod';

interface EnvironmentConfig {
  API_BASE_URL: string;
  E2E_BASE_URL: string;
}

const profiles: Record<Profile, EnvironmentConfig> = {
  dev: {
    API_BASE_URL: 'https://reqres.in',
    E2E_BASE_URL: 'https://www.saucedemo.com',
  },
  stg: {
    API_BASE_URL: process.env.STG_API_BASE_URL || 'https://reqres.in',
    E2E_BASE_URL: process.env.STG_E2E_BASE_URL || 'https://www.saucedemo.com',
  },
  prod: {
    API_BASE_URL: process.env.PROD_API_BASE_URL || 'https://reqres.in',
    E2E_BASE_URL: process.env.PROD_E2E_BASE_URL || 'https://www.saucedemo.com',
  },
};

const PROFILE = (process.env.TEST_PROFILE as Profile) || 'dev';
const profileConfig = profiles[PROFILE] || profiles.dev;

export const ENV = {
  PROFILE,
  API_BASE_URL: process.env.API_BASE_URL || profileConfig.API_BASE_URL,
  REQRES_API_KEY: process.env.REQRES_API_KEY || '',
  E2E_BASE_URL: process.env.E2E_BASE_URL || profileConfig.E2E_BASE_URL,
  HEADLESS: process.env.HEADLESS !== 'false',
  SLOW_MO: parseInt(process.env.SLOW_MO || '0', 10),
  TIMEOUT: parseInt(process.env.TIMEOUT || '30000', 10),
};
