import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import type { Apps } from './enums';
import { SharedModule } from './enums';
import { getAppModuleFederationConfig } from './module-federation';
import type { SharedModulesConfig } from './types';

export const getSharedModulesConfig = (
  dependencies: Record<string, string>
): SharedModulesConfig => {
  return Object.values(SharedModule).reduce((sharedModulesConfig, moduleName) => {
    if (dependencies[moduleName]) {
      sharedModulesConfig[moduleName] = {
        singleton: true,
        requiredVersion: dependencies[moduleName]
      };
    }
    return sharedModulesConfig;
  }, {} as SharedModulesConfig);
};

export const getBundleAnalyzerPlugin = (appName: Apps) =>
  new BundleAnalyzerPlugin({
    analyzerPort: getAppModuleFederationConfig(appName).analyzerPort
  });
