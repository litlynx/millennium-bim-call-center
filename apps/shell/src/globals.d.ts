import '@testing-library/jest-dom';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'bun:test' {
  interface Matchers<T = unknown, R = unknown> extends TestingLibraryMatchers<T, R> {}
}

declare global {
  namespace jest {
    interface Matchers<R = unknown> extends TestingLibraryMatchers<void, R> {}
  }
}
