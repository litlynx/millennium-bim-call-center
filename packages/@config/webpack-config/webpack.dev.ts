import * as path from 'node:path';
import * as webpack from 'webpack';
import 'webpack-dev-server';
import { merge } from 'webpack-merge';

import getCommonConfig from './webpack.common';

const getDevCommonConfig = ({ port }: { port: number }): webpack.Configuration =>
  merge(getCommonConfig(), {
    mode: 'development',
    devServer: {
      static: {
        directory: path.join(process.cwd(), 'dist')
      },
      port: port || 3001,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'Surrogate-Control': 'no-store',
        'Access-Control-Allow-Origin': '*'
      },
      devMiddleware: {
        writeToDisk: true
      },
      historyApiFallback: true,
      hot: 'only'
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        API_BASE_URL: 'https://swapi.dev'
      })
    ]
  });

export default getDevCommonConfig;
