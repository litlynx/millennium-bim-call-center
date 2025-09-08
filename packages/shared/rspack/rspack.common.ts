<<<<<<< HEAD
=======
/* Shared packages rspack config */

import * as path from 'node:path';
>>>>>>> 6f3fd25 ([sc-72] project fix first render issue (#22))
import { Apps } from '@config/rspack-config/enums';
import {
    getAppModuleFederationConfig,
    getDtsModuleConfig
} from '@config/rspack-config/module-federation';
import type { CompleteModuleFederationConfig } from '@config/rspack-config/types';
import { getSharedModulesConfig } from '@config/rspack-config/utils';
import * as rspack from '@rspack/core';
import * as path from 'node:path';
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
      shared: {
        ...getSharedModulesConfig(dependencies),
        // Share core React libs without eagerly bundling them into the initial chunk
        // This keeps the vendors bundle smaller while still allowing the host to provide them.
        react: {
          singleton: true,
          requiredVersion: dependencies.react,
          eager: false
        },
        'react-dom': {
          singleton: true,
          requiredVersion: dependencies['react-dom'],
          eager: false
        },
        'react-dom/client': {
          singleton: true,
          requiredVersion: dependencies['react-dom'],
          eager: false
        }
      }
    } as CompleteModuleFederationConfig)
  ]
});

export default getCommonConfig;
