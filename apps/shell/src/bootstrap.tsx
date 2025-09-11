import { createRoot } from 'react-dom/client';
import GlobalStylesProvider from 'shared/styles/Global';
import App from './Shell';

const container = document.getElementById('app');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

// For Module Federation with script/global remotes, ensure each container is initialized
// with the share scope before first consumption. This is usually auto-handled, but some
// split/runtime settings can race. We defensively init if globals are present.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const __webpack_share_scopes__: Record<string, unknown>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const __webpack_init_sharing__: (scope: string) => Promise<void> | void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const shared: unknown;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const headerPages: unknown;

(async () => {
  try {
    if (typeof __webpack_init_sharing__ === 'function') {
      await __webpack_init_sharing__('default');
    }
    if (typeof (shared as { init?: (scope: unknown) => unknown })?.init === 'function') {
      await (shared as { init: (scope: unknown) => Promise<void> | void }).init(
        __webpack_share_scopes__.default
      );
    }
    if (typeof (headerPages as { init?: (scope: unknown) => unknown })?.init === 'function') {
      await (headerPages as { init: (scope: unknown) => Promise<void> | void }).init(
        __webpack_share_scopes__.default
      );
    }
  } catch {
    // ignore init errors; normal import will still try
  }

  root.render(
    <GlobalStylesProvider>
      <App />
    </GlobalStylesProvider>
  );
})();
