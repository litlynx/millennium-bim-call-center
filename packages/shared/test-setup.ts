import { afterEach } from 'bun:test';
import { GlobalRegistrator } from '@happy-dom/global-registrator';

// Register Happy DOM globals FIRST, before any other imports
GlobalRegistrator.register();

// Now that DOM is available, import testing library
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Ensure document.body exists
if (typeof document !== 'undefined' && !document.body) {
  document.body = document.createElement('body');
  document.documentElement.appendChild(document.body);
}

// Clean up after each test
afterEach(() => {
  cleanup();
});
