import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');

if (!container) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(container);
root.render(
  <div>
    This is a package of components/utils/services/etc., not the app. This package is intended to be
    used in other apps, not standalone
  </div>
);
