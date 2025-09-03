import type { Configuration as RspackConfiguration } from '@rspack/core';
import { merge } from 'webpack-merge';
import getCommonConfig from './rspack.common';

const getProdCommonConfig = (): RspackConfiguration =>
  merge(getCommonConfig(), {
    devtool: false,
    mode: 'production',
    optimization: {
      // Rspack includes terser-like minify by default; keep default
    },
    plugins: []
  });

export default getProdCommonConfig;
