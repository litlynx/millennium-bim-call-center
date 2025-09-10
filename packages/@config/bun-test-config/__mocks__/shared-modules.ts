// Global mock setup for shared modules in Bun test
import { mock } from 'bun:test';

// Mock shared/lib/utils globally
mock.module('shared/lib/utils', () => import('../../../shared/src/__mocks__/shared/lib/utils'));

// Mock shared/components globally
mock.module('shared/components', () => import('../../../shared/src/__mocks__/shared/components'));

// Mock react-router globally
mock.module('react-router', () => import('../../../shared/src/__mocks__/react-router'));

// Mock shared/styles/Global
mock.module('shared/styles/Global', () => ({
  default: ({ children }: { children: React.ReactNode }) => children
}));
