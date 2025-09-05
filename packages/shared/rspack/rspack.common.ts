import * as path from 'node:path';
import { Apps } from '@config/rspack-config/enums';
import {
  getAppModuleFederationConfig,
  getDtsModuleConfig
} from '@config/rspack-config/module-federation';
import type { CompleteModuleFederationConfig } from '@config/rspack-config/types';
import { getSharedModulesConfig } from '@config/rspack-config/utils';
import * as rspack from '@rspack/core';
import { dependencies } from '../package.json';

const getCommonConfig = (): rspack.Configuration => ({
  resolve: {
    tsConfig: {
      configFile: path.resolve(__dirname, '../tsconfig.json')
    }
  },
  module: {
    rules: [getDtsModuleConfig(Apps.shared)]
  },
  plugins: [
    new rspack.container.ModuleFederationPlugin({
      ...getAppModuleFederationConfig(Apps.shared).baseConfig,
      shared: getSharedModulesConfig(dependencies)
    } as CompleteModuleFederationConfig)
  ]
});

export default getCommonConfig;
