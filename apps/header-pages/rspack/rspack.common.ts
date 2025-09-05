import * as path from 'node:path';
import { Apps } from '@config/rspack-config/enums';
import {
  getAppModuleFederationConfig,
  getDtsModuleConfig
} from '@config/rspack-config/module-federation';
import type { CommonModuleFederationConfig } from '@config/rspack-config/types';
import { getSharedModulesConfig } from '@config/rspack-config/utils';
import * as rspack from '@rspack/core';
import { dependencies } from '../package.json';

export const getCommonModuleFederationConfig = (): CommonModuleFederationConfig => ({
  ...getAppModuleFederationConfig(Apps['header-pages']).baseConfig,
  shared: {
    ...getSharedModulesConfig(dependencies),
    'react-router': {
      singleton: true,
      requiredVersion: dependencies['react-router']
    }
  }
});

const getCommonConfig = (): rspack.Configuration => ({
  resolve: {
    tsConfig: {
      configFile: path.resolve(__dirname, '../tsconfig.json')
    }
  },
  module: {
    rules: [getDtsModuleConfig(Apps['header-pages'])]
  },
  plugins: [
    new rspack.CopyRspackPlugin({
      patterns: [{ from: './public/manifest.json', to: './manifest.json' }]
    })
  ]
});

export default getCommonConfig;
