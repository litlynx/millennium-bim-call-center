import type { Config } from 'jest';

export default async (): Promise<Config> => {
  return {
    roots: ['<rootDir>/src'],
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.(tsx|ts)?$': [
        'ts-jest',
        {
          useESM: true
        }
      ]
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom', '@config/bun-test-config/setup-tests.ts'],
    moduleNameMapper: {
      // Map assets and styles
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        '@config/bun-test-config/__mocks__/fileMock.js',
      '\\.(css|less)$': '@config/bun-test-config/__mocks__/styleMock.js',
      // Resolve Module Federation remote 'shared/*' imports to the monorepo source
      '^shared/(.*)$': '<rootDir>/../../packages/shared/src/$1'
    },
    // Suppress deprecation warnings globally
    silent: false,
    verbose: true
  };
};
