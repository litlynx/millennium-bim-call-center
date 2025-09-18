/*
  Bun-only Testing Library setup. Under Jest this file is safe and does nothing.
  When running with Bun (bun:test), we augment matchers using the vitest bundle
  and register cleanup after each test.
*/
try {
  // Dynamically require only when bun:test globals exist
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const bunTest = require('bun:test');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { cleanup } = require('@testing-library/react');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const matchers = require('@testing-library/jest-dom/vitest');

  // Extend expect with DOM matchers in Bun
  bunTest.expect.extend(matchers);
  bunTest.afterEach(() => cleanup());
} catch {
  // Not running under Bun; no-op
}
