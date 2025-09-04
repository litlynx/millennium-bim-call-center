import type { ModuleFederationPluginOptions } from '@module-federation/rsbuild-plugin';
import type { Apps } from './enums';

export type SharedModulesConfig = Record<string, { singleton: boolean; requiredVersion: string }>;

export type AppModuleFederationConfig = {
  devPort: number;
  analyzerPort: number;
  baseConfig: ModuleFederationPluginOptions;
  remotes?: {
    dev: Record<string, string>;
    prod: Record<string, string>;
  };
};

export type CommonModuleFederationConfig = ModuleFederationPluginOptions & {
  shared: SharedModulesConfig;
};

export type CompleteModuleFederationConfig = CommonModuleFederationConfig & {
  remotes?: Record<string, string>;
};

export type AppsModuleFederationConfig = {
  [key in Apps]: AppModuleFederationConfig;
};
