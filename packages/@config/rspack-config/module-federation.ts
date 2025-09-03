import { Apps } from './enums';
import type { AppModuleFederationConfig, AppsModuleFederationConfig } from './types';

const hostBaseUrl = process.env.HOST_BASE_URL || '/';

const PORT_CONFIG = {
  DEV_BASE_PORT: parseInt(process.env.DEV_BASE_PORT || '3000', 10),
  ANALYZER_BASE_PORT: parseInt(process.env.ANALYZER_BASE_PORT || '4000', 10)
} as const;

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

const generatePortMappings = () => {
  const portMappings: Record<Apps, { devPort: number; analyzerPort: number }> = {} as Record<
    Apps,
    { devPort: number; analyzerPort: number }
  >;

  const appEntries = Object.values(Apps).filter((value) => typeof value === 'number') as Apps[];

  appEntries.forEach((enumValue, index) => {
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

const mapPorts = generatePortMappings();

export const logPortConfiguration = () => {
  console.log('🚀 Port Configuration:');
  Object.entries(mapPorts).forEach(([app, config]) => {
    console.log(`   ${app}: dev=${config.devPort}, analyzer=${config.analyzerPort}`);
  });
};

export const getPortMappings = () => mapPorts;

const appsModuleFederationConfig: AppsModuleFederationConfig = {
  [Apps.shell]: {
    devPort: mapPorts[Apps.shell].devPort,
    analyzerPort: mapPorts[Apps.shell].analyzerPort,
    baseConfig: {
      name: 'shell',
      filename: 'remoteEntry.js'
    },
    remotes: {
      dev: {
        shared: `shared@http://localhost:${mapPorts[Apps.shared].devPort}/remoteEntry.js`
      },
      prod: {
        shared: `shared@${hostBaseUrl}packages/shared/dist/remoteEntry.js`
      }
    }
  },
  [Apps.shared]: {
    devPort: mapPorts[Apps.shared].devPort,
    analyzerPort: mapPorts[Apps.shared].analyzerPort,
    baseConfig: {
      name: 'shared',
      filename: 'remoteEntry.js',
      exposes: {
        './components': './src/components',
        './components/ui': './src/components/ui',
        './components/Icon': './src/components/Icon/Icon',
        './styles/Global': './src/styles/GlobalStyles',
        './lib/utils': './src/lib/utils'
      }
    }
  }
};

export const getAppModuleFederationConfig = (appName: Apps): AppModuleFederationConfig =>
  appsModuleFederationConfig[appName];

export const getDtsModuleConfig = (_appName: Apps) => ({
  // Rspack will use @module-federation/dts-plugin; this placeholder keeps API parity for consumers.
  test: /\.tsx?$/,
  exclude: /node_modules/,
  use: []
});
