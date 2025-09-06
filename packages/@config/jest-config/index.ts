import type { Config } from 'jest';

export default async (): Promise<Config> => {
  return {
    roots: ['<rootDir>/src'],
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.(tsx|ts)?$': 'ts-jest'
    },
    setupFilesAfterEnv: [
      '@testing-library/jest-dom'
      // Removed '@config/jest-config/setupTests.ts' to avoid cycles and workspace alias hacks
    ],
    moduleNameMapper: {
      // Map assets and styles
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        '@config/jest-config/__mocks__/fileMock.js',
      '\\.(css|less)$': '@config/jest-config/__mocks__/styleMock.js',
      // Resolve Module Federation remote 'shared/*' imports to the monorepo source
      '^shared/(.*)$': '<rootDir>/../../packages/shared/src/$1'
    },
    verbose: true
  };
};
