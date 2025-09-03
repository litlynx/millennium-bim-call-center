import path from 'node:path';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';

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
    pluginModuleFederation({
      name: 'shell',
      remotes: {
        shared: 'shared@http://localhost:3001/mf-manifest.json'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
      }
    })
  ],
  server: {
    port: 3000
  },
  html: {
    template: path.resolve(__dirname, '../public/index.html')
  }
});
