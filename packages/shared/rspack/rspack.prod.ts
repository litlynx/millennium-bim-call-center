/* Shared packages rspack config */

import { Apps } from '@config/rspack-config/enums';
import getProdCommonConfig from '@config/rspack-config/rspack.prod';
import { getBundleAnalyzerPlugin } from '@config/rspack-config/utils';
import type * as rspack from '@rspack/core';
import { merge } from 'webpack-merge';
import getCommonConfig from './rspack.common';

const getProdConfig = (env: Record<string, string | boolean>): rspack.Configuration =>
  merge(getProdCommonConfig(), getCommonConfig(), {
    optimization: {
      // Enable deterministic ids for better long-term caching
      moduleIds: 'deterministic',
      chunkIds: 'deterministic',
      // Important: Do NOT split chunks for remotes; keep container runtime and exposes together
      // to avoid remoteEntryExports being undefined at runtime.
      splitChunks: false
    },
    performance: {
      // These warnings are noisy for a component library; tune budgets sensibly
      hints: 'warning',
      maxAssetSize: 350 * 1024,
      maxEntrypointSize: 550 * 1024
    },
    plugins: [...(env.analyze ? [getBundleAnalyzerPlugin(Apps.shared)] : [])]
  });

export default getProdConfig;
