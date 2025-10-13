import { Apps } from './enums';
import type { AppModuleFederationConfig, AppsModuleFederationConfig } from './types';

// Unique id per build/run for cache-busting (can be overridden via env for debugging)
const DEV_BUILD_ID = process.env.DEV_BUILD_ID || String(Date.now());

// Ensure a base URL ends with a single trailing slash
const ensureTrailingSlash = (url: string) => (url.endsWith('/') ? url : `${url}/`);

// If pointing to localhost, add a cache-busting query to avoid stale remoteEntry caching during preview/prod-serve
const withLocalhostCacheBust = (fullUrl: string) => {
  const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\\d+)?\//.test(fullUrl);
  if (!isLocalhost) return fullUrl;
  const sep = fullUrl.includes('?') ? '&' : '?';
  return `${fullUrl}${sep}cb=${DEV_BUILD_ID}`;
};

const hostBaseUrl = process.env.HOST_BASE_URL || '/';
// Helper to resolve a remote base URL in this priority:
// 1) Explicit per-remote env (SHARED_HOST_BASE_URL / HEADER_PAGES_HOST_BASE_URL/ SIDEBAR_PAGES_HOST_BASE_URL)
// 2) Absolute HOST_BASE_URL + path
// 3) Local preview fallback to http://localhost:<port>/ when HOST_BASE_URL is relative (e.g. '/')
const resolveRemoteBaseUrl = (
  explicitEnvBase: string | undefined,
  pathUnderHost: string,
  localhostPort: number
) => {
  if (explicitEnvBase) return ensureTrailingSlash(explicitEnvBase);
  const isAbsoluteHost = /^https?:\/\//.test(hostBaseUrl);
  if (isAbsoluteHost) return ensureTrailingSlash(`${hostBaseUrl}${pathUnderHost}`);
  // Fallback for local preview: always use explicit localhost ports so static servers don’t rewrite to index.html
  return ensureTrailingSlash(`http://localhost:${localhostPort}/`);
};

// Allow overriding prod remote base URLs per app when previewing locally on different ports
// e.g. SHARED_HOST_BASE_URL=http://localhost:8081/ HEADER_PAGES_HOST_BASE_URL=http://localhost:8082/ SIDEBAR_PAGES_HOST_BASE_URL=http://localhost:8083 / RECORDS_PAGES_HOST_BASE_URL=http://localhost:8084/
const sharedHostBaseUrl = resolveRemoteBaseUrl(
  process.env.SHARED_HOST_BASE_URL,
  'packages/shared/dist/',
  parseInt(process.env.SHARED_PREVIEW_PORT || '8081', 10)
);
const headerPagesHostBaseUrl = resolveRemoteBaseUrl(
  process.env.HEADER_PAGES_HOST_BASE_URL,
  'apps/header-pages/dist/',
  parseInt(process.env.HEADER_PAGES_PREVIEW_PORT || '8082', 10)
);
const sidebarPagesHostBaseUrl = resolveRemoteBaseUrl(
  process.env.SIDEBAR_PAGES_HOST_BASE_URL,
  'apps/sidebar-pages/dist/',
  parseInt(process.env.SIDEBAR_PAGES_PREVIEW_PORT || '8083', 10)
);
const recordsPagesHostBaseUrl = resolveRemoteBaseUrl(
  process.env.RECORDS_PAGES_HOST_BASE_URL,
  'apps/records-pages/dist/',
  parseInt(process.env.RECORDS_PAGES_PREVIEW_PORT || '8084', 10)
);
const documentationPagesHostBaseUrl = resolveRemoteBaseUrl(
  process.env.DOCUMENTATION_PAGES_HOST_BASE_URL,
  'apps/documentation-pages/dist/',
  parseInt(process.env.DOCUMENTATION_PAGES_PREVIEW_PORT || '8085', 10)
);

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

  appEntries.forEach((enumValue) => {
    // Get the string name of the enum
    const appName = Apps[enumValue];
    const calculatedDevPort = PORT_CONFIG.DEV_BASE_PORT + enumValue;
    const calculatedAnalyzerPort = PORT_CONFIG.ANALYZER_BASE_PORT + enumValue;

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
        // Add cache-busting query so Firefox doesn't serve a cached remoteEntry in dev
        shared: `shared@http://localhost:${
          mapPorts[Apps.shared].devPort
        }/remoteEntry.js?cb=${DEV_BUILD_ID}`,
        // Exposes from apps/header-pages
        headerPages: `headerPages@http://localhost:${
          mapPorts[Apps['header-pages']].devPort
        }/remoteEntry.js?cb=${DEV_BUILD_ID}`,
        // Exposes from apps/sidebar-pages
        sidebarPages: `sidebarPages@http://localhost:${
          mapPorts[Apps['sidebar-pages']].devPort
        }/remoteEntry.js?cb=${DEV_BUILD_ID}`,
        // Exposes from apps/records-pages
        recordsPages: `recordsPages@http://localhost:${
          mapPorts[Apps['records-pages']].devPort
        }/remoteEntry.js?cb=${DEV_BUILD_ID}`,
        // Exposes from apps/documentation-pages
        documentationPages: `documentationPages@http://localhost:${
          mapPorts[Apps['documentation-pages']].devPort
        }/remoteEntry.js?cb=${DEV_BUILD_ID}`
      },
      prod: {
        // In preview/local prod-serve, add cache-busting to avoid stale remoteEntry caches
        shared: `shared@${withLocalhostCacheBust(`${sharedHostBaseUrl}remoteEntry.js`)}`,
        // Assuming production assets are served from apps/header-pages/dist; adjust if deploy layout differs
        headerPages: `headerPages@${withLocalhostCacheBust(
          `${headerPagesHostBaseUrl}remoteEntry.js`
        )}`,
        // Assuming production assets are served from apps/sidebar-pages/dist; adjust if deploy layout differs
        sidebarPages: `sidebarPages@${withLocalhostCacheBust(
          `${sidebarPagesHostBaseUrl}remoteEntry.js`
        )}`,
        // Assuming production assets are served from apps/records-pages/dist; adjust if deploy layout differs
        recordsPages: `recordsPages@${withLocalhostCacheBust(
          `${recordsPagesHostBaseUrl}remoteEntry.js`
        )}`,
        // Exposes from apps/documentation-pages/dist
        documentationPages: `documentationPages@${withLocalhostCacheBust(
          `${documentationPagesHostBaseUrl}remoteEntry.js`
        )}`
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
        './lib/utils': './src/lib/utils',
        './queries': './src/queries',
        './stores': './src/stores',
        './types': './src/types'
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
        './App': './src/App',
        './ChannelAndServicesPage': './src/ChannelsAndServices/pages/ChannelAndServicesPage',
        './Vision360Page': './src/Vision360/pages/Vision360Page',
        './HeaderDiv': './src/HeaderDiv'
      }
    },
    remotes: {
      dev: {
        // Add cache-busting query so Firefox doesn't serve a cached remoteEntry in dev
        shared: `shared@http://localhost:${
          mapPorts[Apps.shared].devPort
        }/remoteEntry.js?cb=${DEV_BUILD_ID}`
      },
      prod: {
        shared: `shared@${withLocalhostCacheBust(`${sharedHostBaseUrl}remoteEntry.js`)}`
      }
    }
  },
  [Apps['sidebar-pages']]: {
    devPort: mapPorts[Apps['sidebar-pages']].devPort,
    analyzerPort: mapPorts[Apps['sidebar-pages']].analyzerPort,
    baseConfig: {
      name: 'sidebarPages',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App',
        './Sidebar': './src/Sidebar'
      }
    },
    remotes: {
      dev: {
        // Add cache-busting query so Firefox doesn't serve a cached remoteEntry in dev
        shared: `shared@http://localhost:${
          mapPorts[Apps.shared].devPort
        }/remoteEntry.js?cb=${DEV_BUILD_ID}`
      },
      prod: {
        shared: `shared@${withLocalhostCacheBust(`${sharedHostBaseUrl}remoteEntry.js`)}`
      }
    }
  },
  [Apps['records-pages']]: {
    devPort: mapPorts[Apps['records-pages']].devPort,
    analyzerPort: mapPorts[Apps['records-pages']].analyzerPort,
    baseConfig: {
      name: 'recordsPages',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App'
      }
    },
    remotes: {
      dev: {
        // Add cache-busting query so Firefox doesn't serve a cached remoteEntry in dev
        shared: `shared@http://localhost:${
          mapPorts[Apps.shared].devPort
        }/remoteEntry.js?cb=${DEV_BUILD_ID}`
      },
      prod: {
        shared: `shared@${withLocalhostCacheBust(`${sharedHostBaseUrl}remoteEntry.js`)}`
      }
    }
  },
  [Apps['documentation-pages']]: {
    devPort: mapPorts[Apps['documentation-pages']].devPort,
    analyzerPort: mapPorts[Apps['documentation-pages']].analyzerPort,
    baseConfig: {
      name: 'documentationPages',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App'
      }
    },
    remotes: {
      dev: {
        // Add cache-busting query so Firefox doesn't serve a cached remoteEntry in dev
        shared: `shared@http://localhost:${
          mapPorts[Apps.shared].devPort
        }/remoteEntry.js?cb=${DEV_BUILD_ID}`
      },
      prod: {
        shared: `shared@${withLocalhostCacheBust(`${sharedHostBaseUrl}remoteEntry.js`)}`
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
