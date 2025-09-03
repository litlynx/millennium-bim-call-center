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

// Determine the public path based on the mode
const mode = process.env.RSBUILD_MODE || (process.env.NODE_ENV === 'production' ? 'prod' : 'dev');
let publicPath = '/';

if (mode === 'preview' || mode === 'dev') {
  // In preview and dev modes, use absolute URL so shell can load assets correctly
  publicPath = `http://localhost:${sharedConfig.devPort}/`;
} else {
  // In production, use relative path
  publicPath = '/';
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
      ...(mode === 'preview' || mode === 'dev'
        ? {
            publicPath: publicPath,
            manifest: true
          }
        : {})
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
