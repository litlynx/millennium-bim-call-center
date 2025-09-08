import { resolve as pathResolve } from 'node:path';
import type { Config } from 'jest';

export default async (): Promise<Config> => {
  // Resolve paths relative to this package to avoid moduleNameMapper collisions
  // Use CommonJS global __dirname so Jest can compile this TS config without requiring ESM module settings
  const baseDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();
  const setupTestsPath = pathResolve(baseDir, 'setup-tests.ts');
  const testingLibraryPath = pathResolve(baseDir, 'testing-library.ts');

  return {
    roots: ['<rootDir>/src'],
    testEnvironment: 'jsdom',
    // Collect coverage and exclude assets from it
    collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}', '!<rootDir>/src/**/assets/**'],
    coveragePathIgnorePatterns: ['<rootDir>/src/**/assets/'],
    transform: {
      '^.+\\.(tsx|ts)?$': [
        'ts-jest',
        {
          useESM: true
        }
      ]
    },
    // Jest environment: use jsdom and extend matchers via jest-dom.
    // Do not register happy-dom or Bun-specific hooks here.
    setupFilesAfterEnv: ['@testing-library/jest-dom', setupTestsPath, testingLibraryPath],
    moduleNameMapper: {
      // Map assets and styles
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        '@config/bun-test-config/__mocks__/fileMock.js',
      '\\.(css|less)$': '@config/bun-test-config/__mocks__/styleMock.js',
      // Path mappings from tsconfig
      '^@/(.*)$': '<rootDir>/src/$1',
      '^@components/(.*)$': '<rootDir>/src/components/$1',
      '^@lib/(.*)$': '<rootDir>/src/lib/$1',
      '^@styles/(.*)$': '<rootDir>/src/styles/$1',
      '^@utils/(.*)$': '<rootDir>/src/utils/$1',
      '^@config/(.*)$': '<rootDir>/src/config/$1',
      '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
      '^@types/(.*)$': '<rootDir>/src/types/$1',
      '^@assets/(.*)$': '<rootDir>/src/assets/$1',
      '^@ui/(.*)$': '<rootDir>/src/components/ui/$1',
      // Resolve Module Federation remote 'shared/*' imports to the monorepo source
      '^shared/(.*)$': '<rootDir>/../../packages/shared/src/$1'
    },
    // Suppress deprecation warnings globally
    silent: false,
    verbose: true
  };
};
