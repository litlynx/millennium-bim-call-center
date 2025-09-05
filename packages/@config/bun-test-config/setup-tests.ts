// Cross-runner Testing Library setup:
// - In Jest: testEnvironment is jsdom. We import jest-dom to extend matchers.
// - In Bun: happy-dom is registered via bunfig.toml preload. This file still
//   runs and sets up cleanup for Testing Library.

// Use Vitest-compatible matchers so Bun doesn't rely on Jest's expect utils
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

// Register cleanup after each test for both Jest and Bun without importing
// runner-specific globals. We rely on globalThis to avoid type issues.
type AfterEachFn = ((fn: () => void) => void) | undefined;
const afterEachGlobal = (globalThis as { afterEach?: (fn: () => void) => void })
  .afterEach as AfterEachFn;
afterEachGlobal?.(() => {
  cleanup();
});
