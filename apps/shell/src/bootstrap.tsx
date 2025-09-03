import { createRoot } from 'react-dom/client';
import GlobalStylesProvider from 'shared/styles/Global';
import App from './Shell';

const container = document.getElementById('app');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
  <GlobalStylesProvider>
    <App />
  </GlobalStylesProvider>
);
