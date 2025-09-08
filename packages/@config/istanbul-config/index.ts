import type { Config } from 'jest';

export default async (): Promise<Config> => {
  return {
    // NYC will handle coverage collection
    collectCoverage: true,
    collectCoverageFrom: [
      '<rootDir>/src/**/*.{ts,tsx}',
      '!<rootDir>/src/**/assets/**',
      '!<rootDir>/src/**/*.stories.{ts,tsx}',
      '!<rootDir>/src/**/*.test.{ts,tsx}'
    ],
    // Valid regex patterns for Jest to ignore from coverage
    coveragePathIgnorePatterns: [
      '/src/.*/assets/',
      // common entry/index/type/mock/bootstrap files
      '[\\/](index|types|bootstrap|main)\\.(tsx|ts)$',
      '[\\/]mock-data[\\/]'
    ],
    coverageReporters: ['text', 'lcov', 'html'],
    coverageDirectory: '<rootDir>/coverage'
  };
};
