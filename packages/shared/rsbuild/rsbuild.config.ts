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

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation(
      createMFConfig(Apps.shared, {
        shared: getSharedModulesConfig(dependencies)
      })
    )
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
