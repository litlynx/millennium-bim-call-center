// Ensure TypeScript picks up jest-dom's global definitions (runtime augmentation)
import '@testing-library/jest-dom';
// Import matcher types for augmentation
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

// Extend Bun's matcher types with Testing Library matchers
declare module 'bun:test' {
  interface Matchers<T = unknown, R = unknown> extends TestingLibraryMatchers<T, R> {}
}

// Extend Jest's matcher types with Testing Library matchers
declare global {
  namespace jest {
    interface Matchers<R = unknown> extends TestingLibraryMatchers<void, R> {}
  }
}
