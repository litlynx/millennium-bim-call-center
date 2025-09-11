// Global mock setup for shared modules in Bun test
import { mock } from 'bun:test';
import type React from 'react';

// Mock shared/lib/utils globally
mock.module('shared/lib/utils', () => import('../../../shared/src/__mocks__/shared/lib/utils'));

// Mock shared/components globally
mock.module('shared/components', () => import('../../../shared/src/__mocks__/shared/components'));

// Avoid globally mocking 'react-router' to prevent circular/partial init issues.
// Individual tests that need navigation spying should locally
// mock 'react-router' and/or import navigateSpy from the shared mock.

// Mock shared/styles/Global
mock.module('shared/styles/Global', () => ({
  default: ({ children }: { children: React.ReactNode }) => children
}));
