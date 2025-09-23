import { Apps } from '@config/rspack-config/enums';
import { getAppModuleFederationConfig } from '@config/rspack-config/module-federation';
import getDevCommonConfig from '@config/rspack-config/rspack.dev';
import * as rspack from '@rspack/core';
import { merge } from 'webpack-merge';

import getCommonConfig, { getCommonModuleFederationConfig } from './rspack.common';

const getDevConfig = (): rspack.Configuration =>
  merge(
    getDevCommonConfig({
      port: getAppModuleFederationConfig(Apps['header-pages']).devPort
    }),
    getCommonConfig(),
    {
      plugins: [
        new rspack.container.ModuleFederationPlugin({
          ...getCommonModuleFederationConfig(),
          remotes: getAppModuleFederationConfig(Apps['header-pages']).remotes?.dev
        })
      ]
    }
  );

export default getDevConfig;
