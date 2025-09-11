/* packages main rspack config */

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
      minimizer: [new TerserPlugin()],
      // Note: Do NOT force runtimeChunk: 'single' here; remotes need their own runtime bundled
      splitChunks: {
        chunks: 'all',
        // Make sure even small libs like @swc/helpers are extracted
        minSize: 0,
        cacheGroups: {
          // Extract SWC helpers to a single tiny chunk
          swcHelpers: {
            test: /[\\/]node_modules[\\/]@swc[\\/]helpers[\\/]/,
            name: 'swc-helpers',
            chunks: 'all',
            enforce: true,
            priority: 40
          },
          // Generic vendors fallback
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10
          }
        }
      }
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
