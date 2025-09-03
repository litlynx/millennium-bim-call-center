import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';
import { Apps } from './enums';
import type { AppModuleFederationConfig, AppsModuleFederationConfig } from './types';

const hostBaseUrl = process.env.HOST_BASE_URL || '/';

/**
 * Configuration for port ranges and base ports
 */
const PORT_CONFIG = {
  DEV_BASE_PORT: parseInt(process.env.DEV_BASE_PORT || '3000', 10),
  ANALYZER_BASE_PORT: parseInt(process.env.ANALYZER_BASE_PORT || '4000', 10)
} as const;

/**
 * Gets port from environment variable with fallback to calculated port
 */
const getPortFromEnv = (
  appName: string,
  type: 'dev' | 'analyzer',
  fallbackPort: number
): number => {
  const envVar = `${appName.toUpperCase()}_${type.toUpperCase()}_PORT`;
  const envValue = process.env[envVar];

  if (envValue) {
    const parsedPort = parseInt(envValue, 10);
    if (!Number.isNaN(parsedPort) && parsedPort > 0) {
      return parsedPort;
    }
  }

  return fallbackPort;
};

/**
 * Generates port mappings for all apps with auto-incrementing ports and environment variable fallbacks
 */
const generatePortMappings = () => {
  const portMappings: Record<Apps, { devPort: number; analyzerPort: number }> = {} as Record<
    Apps,
    { devPort: number; analyzerPort: number }
  >;

  // Get numeric enum values (the actual enum keys we use)
  const appEntries = Object.values(Apps).filter((value) => typeof value === 'number') as Apps[];

  appEntries.forEach((enumValue, index) => {
    // Get the string name of the enum
    const appName = Apps[enumValue];
    const calculatedDevPort = PORT_CONFIG.DEV_BASE_PORT + index;
    const calculatedAnalyzerPort = PORT_CONFIG.ANALYZER_BASE_PORT + index;

    portMappings[enumValue] = {
      devPort: getPortFromEnv(appName, 'dev', calculatedDevPort),
      analyzerPort: getPortFromEnv(appName, 'analyzer', calculatedAnalyzerPort)
    };
  });

  return portMappings;
};

/**
 * Generated port mappings for all applications
 */
const mapPorts = generatePortMappings();

/**
 * Utility function to log current port configuration (useful for debugging)
 */
export const logPortConfiguration = () => {
  console.log('🚀 Port Configuration:');
  Object.entries(mapPorts).forEach(([app, config]) => {
    console.log(`   ${app}: dev=${config.devPort}, analyzer=${config.analyzerPort}`);
  });
};

/**
 * Export port mappings for external use
 */
export const getPortMappings = () => mapPorts;

const appsModuleFederationConfig: AppsModuleFederationConfig = {
  [Apps.shell]: {
    devPort: mapPorts[Apps.shell].devPort,
    analyzerPort: mapPorts[Apps.shell].analyzerPort,
    baseConfig: createModuleFederationConfig({
      name: 'shell',
      remotes: {},
      dts: false
    }),
    remotes: {
      dev: {
        shared: `shared@http://localhost:${mapPorts[Apps.shared].devPort}/mf-manifest.json`
      },
      prod: {
        shared: `shared@${hostBaseUrl}packages/shared/dist/mf-manifest.json`
      }
    }
  },
  [Apps.shared]: {
    devPort: mapPorts[Apps.shared].devPort,
    analyzerPort: mapPorts[Apps.shared].analyzerPort,
    baseConfig: createModuleFederationConfig({
      name: 'shared',
      exposes: {
        './components': './src/components',
        './components/ui': './src/components/ui',
        './components/Icon': './src/components/Icon/Icon',
        './styles/Global': './src/styles/GlobalStyles',
        './lib/utils': './src/lib/utils'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
      },
      dts: false
    })
  }
};

export const getAppModuleFederationConfig = (appName: Apps): AppModuleFederationConfig =>
  appsModuleFederationConfig[appName];

/**
 * Create Module Federation config for Rsbuild
 */
export const createMFConfig = (appName: Apps, additionalOptions = {}) => {
  const config = getAppModuleFederationConfig(appName);
  return {
    ...config.baseConfig,
    ...additionalOptions
  };
};
