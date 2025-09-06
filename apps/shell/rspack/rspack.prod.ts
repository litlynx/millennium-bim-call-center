/* Shell rspack config */

import { Apps } from '@config/rspack-config/enums';
import { getAppModuleFederationConfig } from '@config/rspack-config/module-federation';
import getProdCommonConfig from '@config/rspack-config/rspack.prod';
import { getBundleAnalyzerPlugin } from '@config/rspack-config/utils';
import * as rspack from '@rspack/core';
import { merge } from 'webpack-merge';

import getCommonConfig, { getCommonModuleFederationConfig } from './rspack.common';

const getProdConfig = (env: Record<string, string | boolean>): rspack.Configuration => {
  return merge(getProdCommonConfig(), getCommonConfig(), {
    optimization: {
      // Split vendors into smaller, named chunks to improve parallelization and avoid single large assets
      splitChunks: {
        chunks: 'all',
        // Encourage splitting when chunks grow big
        maxSize: 200 * 1024, // ~200 KiB
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          // Keep Module Federation runtime libs with the host to avoid isolation issues
          moduleFederationRuntime: {
            test: /[\\/]node_modules[\\/]@module-federation[\\/](webpack-bundler-runtime|runtime|sdk|runtime-core|error-codes)[\\/]/,
            name: 'mf-runtime',
            chunks: 'all',
            priority: 50,
            enforce: true
          },
          // Group core react libs together
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            name: 'react-vendor',
            chunks: 'all',
            priority: 40,
            enforce: true
          },
          // React Router in its own chunk
          router: {
            test: /[\\/]node_modules[\\/]react-router[\\/]/,
            name: 'react-router-vendor',
            chunks: 'all',
            priority: 30,
            enforce: true
          },
          // TanStack Query in its own chunk
          reactQuery: {
            test: /[\\/]node_modules[\\/]@tanstack[\\/]react-query[\\/]/,
            name: 'react-query-vendor',
            chunks: 'all',
            priority: 30,
            enforce: true
          },
          // react-helmet separate
          helmet: {
            test: /[\\/]node_modules[\\/]react-helmet[\\/]/,
            name: 'react-helmet-vendor',
            chunks: 'all',
            priority: 20,
            enforce: true
          },
          // Fallback for remaining vendor code
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      },
      runtimeChunk: 'single'
    },
    // Relax performance thresholds for realistic MFE host sizes while keeping hints in place
    performance: {
      hints: 'warning',
      maxAssetSize: 400 * 1024, // 400 KiB per asset
      maxEntrypointSize: 600 * 1024 // 600 KiB per entrypoint
    },
    plugins: [
      new rspack.container.ModuleFederationPlugin({
        ...getCommonModuleFederationConfig(),
        remotes: getAppModuleFederationConfig(Apps.shell).remotes?.prod
      }),
      ...(env.analyze ? [getBundleAnalyzerPlugin(Apps.shell)] : [])
    ]
  });
};

export default getProdConfig;
