import { Apps } from '@config/rspack-config/enums';
import { getAppModuleFederationConfig } from '@config/rspack-config/module-federation';
import getDevCommonConfig from '@config/rspack-config/rspack.dev';
import { DtsPlugin } from '@module-federation/dts-plugin';
import type { Configuration as RspackConfiguration } from '@rspack/core';
import { merge } from 'webpack-merge';
import getCommonConfig from './rspack.common';

const getDevConfig = (): RspackConfiguration =>
  merge(
    getDevCommonConfig({ port: getAppModuleFederationConfig(Apps.shared).devPort }),
    getCommonConfig(),
    {
      plugins: [
        new DtsPlugin({
          ...getAppModuleFederationConfig(Apps.shared).baseConfig,
          dts: { displayErrorInTerminal: true }
        })
      ]
    }
  );

export default getDevConfig;
