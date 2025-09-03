import { Apps } from '@config/rspack-config/enums';
import getProdCommonConfig from '@config/rspack-config/rspack.prod';
import { getBundleAnalyzerPlugin } from '@config/rspack-config/utils';
import type { Configuration as RspackConfiguration } from '@rspack/core';
import type * as webpack from 'webpack';
import { merge } from 'webpack-merge';
import getCommonConfig from './rspack.common';

const getProdConfig = (env: Record<string, string | boolean>): RspackConfiguration =>
  merge(getProdCommonConfig(), getCommonConfig(), {
    plugins: [
      ...(env.analyze ? [getBundleAnalyzerPlugin(Apps.shared)] : [])
    ] as unknown as webpack.WebpackPluginInstance[]
  });

export default getProdConfig;
