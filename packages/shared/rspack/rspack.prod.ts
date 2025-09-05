import { Apps } from '@config/rspack-config/enums';
import getProdCommonConfig from '@config/rspack-config/rspack.prod';
import { getBundleAnalyzerPlugin } from '@config/rspack-config/utils';
import type * as rspack from '@rspack/core';
import { merge } from 'webpack-merge';
import getCommonConfig from './rspack.common';

const getProdConfig = (env: Record<string, string | boolean>): rspack.Configuration =>
  merge(getProdCommonConfig(), getCommonConfig(), {
    plugins: [...(env.analyze ? [getBundleAnalyzerPlugin(Apps.shared)] : [])]
  });

export default getProdConfig;
