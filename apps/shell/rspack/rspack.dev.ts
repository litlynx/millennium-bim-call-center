import { Apps } from '@config/rspack-config/enums';
import { getAppModuleFederationConfig } from '@config/rspack-config/module-federation';
import getDevCommonConfig from '@config/rspack-config/rspack.dev';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import type { Configuration as RspackConfiguration } from '@rspack/core';
import { merge } from 'webpack-merge';
import getCommonConfig, { getCommonModuleFederationConfig } from './rspack.common';

const getDevConfig = (): RspackConfiguration =>
  merge(
    getDevCommonConfig({ port: getAppModuleFederationConfig(Apps.shell).devPort }),
    getCommonConfig(),
    {
      plugins: [
        new ModuleFederationPlugin({
          ...getCommonModuleFederationConfig(),
          remotes: getAppModuleFederationConfig(Apps.shell).remotes?.dev
        })
      ]
    }
  );

export default getDevConfig;
