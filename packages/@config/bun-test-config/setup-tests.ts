// Cross-runner Testing Library setup:
// - In Jest: testEnvironment is jsdom. We import jest-dom to extend matchers.
// - In Bun: happy-dom is registered via bunfig.toml preload. This file still
//   runs and sets up cleanup for Testing Library.

// Use Jest-compatible matchers in Jest environment
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Register cleanup after each test for both Jest and Bun without importing
// runner-specific globals. We rely on globalThis to avoid type issues.
type AfterEachFn = ((fn: () => void) => void) | undefined;
const afterEachGlobal = (globalThis as { afterEach?: (fn: () => void) => void })
  .afterEach as AfterEachFn;
afterEachGlobal?.(() => {
  cleanup();
});

// Polyfills for Node/Jest environment (jsdom) where Web APIs may be missing
// react-router and other libs may require TextEncoder/TextDecoder
const g = globalThis as unknown as {
  TextEncoder?: typeof TextEncoder;
  TextDecoder?: typeof TextDecoder;
  [k: string]: unknown;
};
if (typeof g.TextEncoder === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { TextEncoder, TextDecoder } = require('node:util');
  g.TextEncoder = TextEncoder;
  g.TextDecoder = TextDecoder;
}
