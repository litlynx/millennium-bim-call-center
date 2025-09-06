import * as path from 'node:path';
import * as rspack from '@rspack/core';
import { ReactRefreshRspackPlugin } from '@rspack/plugin-react-refresh';
import 'webpack-dev-server';
import { merge } from 'webpack-merge';

import getCommonConfig from './rspack.common';

// Ensure SWC "prod" flag in shared config evaluates correctly for dev builds
process.env.NODE_ENV = 'development';

const getDevCommonConfig = ({ port }: { port: number }): rspack.Configuration =>
  merge(getCommonConfig(), {
    mode: 'development',
    devServer: {
      static: {
        directory: path.join(process.cwd(), 'dist')
      },
      port: port || 3001,
      // Ensure browsers (notably Firefox) don't cache dev assets between reloads
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'Surrogate-Control': 'no-store',
        // Helpful for Module Federation across localhost ports
        'Access-Control-Allow-Origin': '*'
      },
      devMiddleware: {
        writeToDisk: true
      },
      historyApiFallback: true,
      hot: 'only'
    },
    plugins: [
      // Inject React Refresh runtime to match SWC refresh transform in dev
      new ReactRefreshRspackPlugin(),
      new rspack.EnvironmentPlugin({
        API_BASE_URL: 'https://swapi.dev'
      })
    ]
  });

export default getDevCommonConfig;
