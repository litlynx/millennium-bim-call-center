import type { RsbuildConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

/**
 * Common Rsbuild configuration shared across all environments
 */
const getCommonConfig = (): RsbuildConfig => ({
  plugins: [pluginReact()],
  html: {
    template: './public/index.html',
    favicon: './public/favicon.png'
  },
  output: {
    target: 'web',
    distPath: {
      root: 'dist'
    },
    assetPrefix: 'auto'
  },
  source: {
    entry: {
      index: './src/main'
    },
    alias: {
      '@': './src'
    }
  },
  tools: {
    postcss: (config) => {
      // Auto-detect postcss.config.js in the project root
      config.postcssOptions = {
        config: true
      };
    }
  }
});

export default getCommonConfig;
