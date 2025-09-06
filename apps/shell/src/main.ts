/* eslint-disable no-console */
void import('./bootstrap');

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
