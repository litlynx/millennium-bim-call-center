import type { RsbuildConfig } from '@rsbuild/core';
import { mergeRsbuildConfig } from '@rsbuild/core';
import getCommonConfig from './rsbuild.common';

/**
 * Development Rsbuild configuration
 */
const getDevConfig = ({ port }: { port: number }): RsbuildConfig =>
  mergeRsbuildConfig(getCommonConfig(), {
    mode: 'development',
    dev: {
      hmr: true,
      liveReload: true
    },
    server: {
      port,
      historyApiFallback: true,
      compress: true
    },
    output: {
      sourceMap: {
        js: 'source-map',
        css: true
      }
    }
  });

export default getDevConfig;
