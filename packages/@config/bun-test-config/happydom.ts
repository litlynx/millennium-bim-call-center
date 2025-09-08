import { GlobalRegistrator } from '@happy-dom/global-registrator';

// Register happy-dom globals for Bun test
GlobalRegistrator.register();

// Establish a stable origin and ensure a body element exists
try {
  if (typeof window !== 'undefined' && window.location?.href === 'about:blank') {
    // react-router/history APIs expect a non-about:blank origin
    window.location.href = 'http://localhost/';
  }
  if (typeof document !== 'undefined' && !document.body) {
    const body = document.createElement('body');
    document.documentElement.appendChild(body);
  }
} catch {
  // no-op: defensive in case environment restrictions block setting location
}
