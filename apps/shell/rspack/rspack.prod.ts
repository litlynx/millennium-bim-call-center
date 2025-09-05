import { Apps } from '@config/rspack-config/enums';
import { getAppModuleFederationConfig } from '@config/rspack-config/module-federation';
import getProdCommonConfig from '@config/rspack-config/rspack.prod';
import { getBundleAnalyzerPlugin } from '@config/rspack-config/utils';
import * as rspack from '@rspack/core';
import { merge } from 'webpack-merge';

import getCommonConfig, { getCommonModuleFederationConfig } from './rspack.common';

const getProdConfig = (env: Record<string, string | boolean>): rspack.Configuration => {
  return merge(getProdCommonConfig(), getCommonConfig(), {
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
