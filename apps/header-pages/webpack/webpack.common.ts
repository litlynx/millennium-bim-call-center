import { Apps } from '@config/webpack-config/enums';
import {
  getAppModuleFederationConfig,
  getDtsModuleConfig
} from '@config/webpack-config/module-federation';
import type { CommonModuleFederationConfig } from '@config/webpack-config/types';
import { getSharedModulesConfig } from '@config/webpack-config/utils';
import CopyPlugin from 'copy-webpack-plugin';
import type * as webpack from 'webpack';
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

const getCommonConfig = (): webpack.Configuration => ({
  module: {
    rules: [getDtsModuleConfig(Apps['header-pages'])]
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: './public/manifest.json', to: './manifest.json' }]
    })
  ]
});

export default getCommonConfig;
