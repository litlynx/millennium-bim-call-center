import {
  Apps,
  createMFConfig,
  getAppModuleFederationConfig,
  getSharedModulesConfig
} from '@config/rsbuild-config';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { dependencies } from '../package.json';

const sharedConfig = getAppModuleFederationConfig(Apps.shared);

// Simple two-mode system: development vs production
const isDevelopment = process.env.NODE_ENV !== 'production';
const hostBaseUrl = process.env.HOST_BASE_URL || '';
const isProduction = process.env.NODE_ENV === 'production';
let publicPath = '/';

if (isDevelopment) {
  // In development mode, use absolute URL so shell can load assets correctly
  publicPath = `http://localhost:${sharedConfig.devPort}/`;
} else if (hostBaseUrl.includes('localhost')) {
  // In preview mode (production build with localhost), use absolute URL
  publicPath = hostBaseUrl;
} else if (isProduction && !hostBaseUrl) {
  // In actual production without explicit host, use absolute URL for shared package
  publicPath = `http://localhost:3001/`;
} else {
  // Default fallback
  publicPath = hostBaseUrl || '/';
}

export default defineConfig({
  output: {
    assetPrefix: publicPath
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      ...createMFConfig(Apps.shared, {
        shared: getSharedModulesConfig(dependencies)
      }),
      publicPath: publicPath,
      manifest: true
    })
  ],
  server: {
    port: getAppModuleFederationConfig(Apps.shared).devPort
  },
  resolve: {
    alias: {
      '@': './src',
      '@components': './src/components',
      '@ui': './src/components/ui',
      '@lib': './src/lib',
      '@styles': './src/styles',
      '@utils': './src/utils',
      '@config': './src/config',
      '@hooks': './src/hooks',
      '@types': './src/types',
      '@assets': './src/assets'
    }
  }
});
