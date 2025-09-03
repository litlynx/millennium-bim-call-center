import * as path from 'node:path';
import type { Configuration as RspackConfiguration } from '@rspack/core';
import { merge } from 'webpack-merge';
import getCommonConfig from './rspack.common';

const getDevCommonConfig = ({ port }: { port: number }): RspackConfiguration =>
  merge(getCommonConfig(), {
    mode: 'development',
    devServer: {
      static: {
        directory: path.join(process.cwd(), 'dist')
      },
      port: port || 3001,
      devMiddleware: {
        writeToDisk: true
      },
      historyApiFallback: true,
      hot: true
    },
    watchOptions: {
      ignored: ['**/node_modules/**', '**/@mf-types/**']
    },
    plugins: []
  });

export default getDevCommonConfig;
