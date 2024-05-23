import type { Config } from '@jest/types';


// Sync object
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  testRegex: '^.+.(test|spec).tsx?$',
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|js)x?$': 'ts-jest'
  }
};
export default config;
