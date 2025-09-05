import { Apps } from '@config/webpack-config/enums';
import { getAppModuleFederationConfig } from '@config/webpack-config/module-federation';
import getDevCommonConfig from '@config/webpack-config/webpack.dev';
import * as webpack from 'webpack';
import { merge } from 'webpack-merge';

import getCommonConfig, { getCommonModuleFederationConfig } from './webpack.common';

const getDevConfig = (): webpack.Configuration =>
  merge(
    getDevCommonConfig({
      port: getAppModuleFederationConfig(Apps['header-pages']).devPort
    }),
    getCommonConfig(),
    {
      plugins: [
        new webpack.container.ModuleFederationPlugin({
          ...getCommonModuleFederationConfig(),
          remotes: getAppModuleFederationConfig(Apps['header-pages']).remotes?.dev
        })
      ]
    }
  );

export default getDevConfig;
