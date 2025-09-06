/* eslint-disable no-console */
// Ensure default share scope is initialized before bootstrap for Module Federation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const __webpack_init_sharing__: (scope: string) => Promise<void> | void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const __webpack_share_scopes__: Record<string, unknown>;

(async () => {
  try {
    if (typeof __webpack_init_sharing__ === 'function') {
      await __webpack_init_sharing__('default');
    }
  } catch {
    // ignore
  }
  void import('./bootstrap');
})();

// Register service worker only in production builds
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

// In development, proactively unregister any existing service workers to avoid stale caches
if (process.env.NODE_ENV !== 'production' && 'serviceWorker' in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().catch(() => {});
      }
    })
    .catch(() => {});
}
