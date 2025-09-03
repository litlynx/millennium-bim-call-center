import { Apps } from '@config/rspack-config/enums';
import { getAppModuleFederationConfig } from '@config/rspack-config/module-federation';
import { getSharedModulesConfig } from '@config/rspack-config/utils';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import type { Configuration as RspackConfiguration } from '@rspack/core';
import { dependencies } from '../package.json';

const getCommonConfig = (): RspackConfiguration => ({
  module: {
    rules: [
      // dts is handled by @module-federation/dts-plugin in build/serve configs, no loader here
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      ...getAppModuleFederationConfig(Apps.shared).baseConfig,
      shared: getSharedModulesConfig(dependencies)
    })
  ]
});

export default getCommonConfig;
