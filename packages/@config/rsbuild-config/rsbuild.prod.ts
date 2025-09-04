import type { RsbuildConfig } from '@rsbuild/core';
import { mergeRsbuildConfig } from '@rsbuild/core';
import { pluginCssMinimizer } from '@rsbuild/plugin-css-minimizer';
import getCommonConfig from './rsbuild.common';

/**
 * Production Rsbuild configuration
 */
const getProdConfig = (): RsbuildConfig =>
  mergeRsbuildConfig(getCommonConfig(), {
    mode: 'production',
    plugins: [pluginCssMinimizer()],
    output: {
      filenameHash: true,
      sourceMap: {
        js: false,
        css: false
      }
    },
    performance: {
      chunkSplit: {
        strategy: 'split-by-experience'
      }
    },
    tools: {
      terser: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    }
  });

export default getProdConfig;
