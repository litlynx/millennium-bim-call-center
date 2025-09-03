import { Apps } from '@config/rspack-config/enums';
import { getAppModuleFederationConfig } from '@config/rspack-config/module-federation';
import getBaseCommon from '@config/rspack-config/rspack.common';
import type { CommonModuleFederationConfig } from '@config/rspack-config/types';
import { getSharedModulesConfig } from '@config/rspack-config/utils';
import type { Configuration as RspackConfiguration } from '@rspack/core';
import CopyPlugin from 'copy-webpack-plugin';
import { merge } from 'webpack-merge';
import { dependencies } from '../package.json';

export const getCommonModuleFederationConfig = (): CommonModuleFederationConfig => ({
  ...getAppModuleFederationConfig(Apps.shell).baseConfig,
  shared: {
    ...getSharedModulesConfig(dependencies),
    'react-router': {
      singleton: true,
      requiredVersion: dependencies['react-router']
    }
  }
});

const getCommonConfig = (): RspackConfiguration =>
  merge(getBaseCommon(), {
    module: {
      rules: []
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: './public/manifest.json', to: './manifest.json' }]
      })
    ]
  });

export default getCommonConfig;
