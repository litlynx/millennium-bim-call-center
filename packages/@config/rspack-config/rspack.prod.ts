import * as rspack from '@rspack/core';
import CompressionPlugin from 'compression-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { merge } from 'webpack-merge';
import WorkboxPlugin from 'workbox-webpack-plugin';

import getCommonConfig from './rspack.common';

// Ensure SWC "prod" flag in shared config evaluates correctly for prod builds
process.env.NODE_ENV = 'production';

const getProdCommonConfig = (): rspack.Configuration =>
  merge(getCommonConfig(), {
    devtool: false,
    mode: 'production',
    optimization: {
      minimizer: [new TerserPlugin()]
    },
    plugins: [
      new rspack.EnvironmentPlugin({
        API_BASE_URL: 'https://swapi.dev'
      }),
      // Generate pre-compressed assets for optimal static serving
      new CompressionPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg|json|txt|xml|wasm)$/i,
        threshold: 1024,
        minRatio: 0.8
      }),
      new CompressionPlugin({
        filename: '[path][base].br',
        algorithm: 'brotliCompress',
        compressionOptions: { level: 11 },
        test: /\.(js|css|html|svg|json|txt|xml|wasm)$/i,
        threshold: 1024,
        minRatio: 0.8
      }),
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true
      })
    ]
  });

export default getProdCommonConfig;
