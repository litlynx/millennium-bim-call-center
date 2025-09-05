/// <reference types="bun-types/test-globals" />

import { afterEach, expect } from 'bun:test';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
// Use the Vitest-compatible matcher bundle for Bun/Vitest environments.
// This avoids relying on Jest's expect utils in @testing-library/jest-dom.
// See: https://testing-library.com/docs/ecosystem-jest-dom/#vitest
import * as matchers from '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

declare module 'bun:test' {
  interface Matchers<T = unknown, R = unknown> extends TestingLibraryMatchers<T, R> {}
}

// Type augmentation so Bun's expect sees jest-dom matchers in TS
declare module 'bun:test' {
  interface Matchers<T = unknown, R = unknown> extends TestingLibraryMatchers<T, R> {}
}

expect.extend(matchers);

// Optional: cleans up `render` after each test
afterEach(() => {
  cleanup();
});
