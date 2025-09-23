import { Apps } from '@config/rspack-config/enums';
import { getAppModuleFederationConfig } from '@config/rspack-config/module-federation';
import getDevCommonConfig from '@config/rspack-config/rspack.dev';
import type * as rspack from '@rspack/core';
import { merge } from 'webpack-merge';
import getCommonConfig from './rspack.common';

const getDevConfig = (): rspack.Configuration =>
  merge(
    getDevCommonConfig({ port: getAppModuleFederationConfig(Apps.shared).devPort }),
    getCommonConfig()
  );

export default getDevConfig;
