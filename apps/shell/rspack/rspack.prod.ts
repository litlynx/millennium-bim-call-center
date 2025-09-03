import { Apps } from '@config/rspack-config/enums';
import { getAppModuleFederationConfig } from '@config/rspack-config/module-federation';
import getProdCommonConfig from '@config/rspack-config/rspack.prod';
import { getBundleAnalyzerPlugin } from '@config/rspack-config/utils';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import type { Configuration as RspackConfiguration } from '@rspack/core';
import { merge } from 'webpack-merge';
import getCommonConfig, { getCommonModuleFederationConfig } from './rspack.common';

const getProdConfig = (env: Record<string, string | boolean>): RspackConfiguration =>
  merge(getProdCommonConfig(), getCommonConfig(), {
    plugins: [
      new ModuleFederationPlugin({
        ...getCommonModuleFederationConfig(),
        remotes: getAppModuleFederationConfig(Apps.shell).remotes?.prod
      }),
      ...(env.analyze ? [getBundleAnalyzerPlugin(Apps.shell)] : [])
    ]
  });

export default getProdConfig;
