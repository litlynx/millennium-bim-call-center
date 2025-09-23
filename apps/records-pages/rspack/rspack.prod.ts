/* Header-Pages rspack config */

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
      // Important: Avoid splitting the remote into many chunks; keep MF bootstrap/exposes intact
      splitChunks: false
    },
    // Relax performance thresholds similar to shell app while keeping hints in place
    performance: {
      hints: 'warning',
      maxAssetSize: 400 * 1024, // 400 KiB per asset
      maxEntrypointSize: 600 * 1024 // 600 KiB per entrypoint
    },
    plugins: [
      new rspack.container.ModuleFederationPlugin({
        ...getCommonModuleFederationConfig(),
        remotes: getAppModuleFederationConfig(Apps['records-pages']).remotes?.prod
      }),
      ...(env.analyze ? [getBundleAnalyzerPlugin(Apps['records-pages'])] : [])
    ]
  });
};

export default getProdConfig;
