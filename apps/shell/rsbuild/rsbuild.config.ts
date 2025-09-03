import path from 'node:path';
import { Apps, createMFConfig, getAppModuleFederationConfig } from '@config/rsbuild-config';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const shellConfig = getAppModuleFederationConfig(Apps.shell);
const remotes =
  process.env.NODE_ENV === 'production'
    ? shellConfig.remotes?.prod || {}
    : shellConfig.remotes?.dev || {};

export default defineConfig({
  source: {
    entry: {
      index: path.resolve(__dirname, '../src/main.ts')
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation(
      createMFConfig(Apps.shell, {
        remotes
      })
    )
  ],
  server: {
    port: 3000
  },
  html: {
    template: path.resolve(__dirname, '../public/index.html')
  }
});
