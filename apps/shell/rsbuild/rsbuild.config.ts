import path from 'node:path';
import { Apps, createMFConfig, getAppModuleFederationConfig } from '@config/rsbuild-config';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const shellConfig = getAppModuleFederationConfig(Apps.shell);

// Determine which remote configuration to use
// Use RSBUILD_MODE environment variable to explicitly set the mode
// or fall back to NODE_ENV detection
let remotes: Record<string, string> = {};

const mode = process.env.RSBUILD_MODE || (process.env.NODE_ENV === 'production' ? 'prod' : 'dev');

if (mode === 'prod') {
  remotes = shellConfig.remotes?.prod || {};
} else if (mode === 'preview') {
  remotes = shellConfig.remotes?.preview || {};
} else {
  remotes = shellConfig.remotes?.dev || {};
}

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
