import * as path from 'node:path';
import * as rspack from '@rspack/core';
import { ReactRefreshRspackPlugin } from '@rspack/plugin-react-refresh';
import { merge } from 'webpack-merge';
import 'webpack-dev-server';

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
