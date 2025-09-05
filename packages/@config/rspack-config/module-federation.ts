import { Apps } from './enums';
import type { AppModuleFederationConfig, AppsModuleFederationConfig } from './types';

const hostBaseUrl = process.env.HOST_BASE_URL || '/';
// Allow overriding prod remote base URLs per app when previewing locally on different ports
// e.g. SHARED_HOST_BASE_URL=http://localhost:8081/ HEADER_PAGES_HOST_BASE_URL=http://localhost:8082/
const sharedHostBaseUrl = (
  process.env.SHARED_HOST_BASE_URL || `${hostBaseUrl}packages/shared/dist/`
).replace(/(?<!:)\/\/$/, '/');
const headerPagesHostBaseUrl = (
  process.env.HEADER_PAGES_HOST_BASE_URL || `${hostBaseUrl}apps/header-pages/dist/`
).replace(/(?<!:)\/\/$/, '/');

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
    baseConfig: {
      name: 'shell',
      filename: 'remoteEntry.js'
    },
    remotes: {
      dev: {
        shared: `shared@http://localhost:${mapPorts[Apps.shared].devPort}/remoteEntry.js`,
        // Exposes from apps/header-pages
        headerPages: `headerPages@http://localhost:${mapPorts[Apps['header-pages']].devPort}/remoteEntry.js`
      },
      prod: {
        shared: `shared@${sharedHostBaseUrl}remoteEntry.js`,
        // Assuming production assets are served from apps/header-pages/dist
        // Adjust this path if your deploy layout differs
        headerPages: `headerPages@${headerPagesHostBaseUrl}remoteEntry.js`
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
  },
  [Apps['header-pages']]: {
    devPort: mapPorts[Apps['header-pages']].devPort,
    analyzerPort: mapPorts[Apps['header-pages']].analyzerPort,
    baseConfig: {
      name: 'headerPages',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App'
      }
    },
    remotes: {
      dev: {
        shared: `shared@http://localhost:${mapPorts[Apps.shared].devPort}/remoteEntry.js`
      },
      prod: {
        shared: `shared@${sharedHostBaseUrl}remoteEntry.js`
      }
    }
  }
};

export const getAppModuleFederationConfig = (appName: Apps): AppModuleFederationConfig =>
  appsModuleFederationConfig[appName];

export const getDtsModuleConfig = (appName: Apps) => ({
  test: /\.tsx?$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'dts-loader',
      options: {
        name: getAppModuleFederationConfig(appName).baseConfig.name,
        exposes: getAppModuleFederationConfig(appName).baseConfig.exposes,
        typesOutputDir: '.wp_federation'
      }
    }
  ]
});
