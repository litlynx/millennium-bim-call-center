// Mock for shared/stores

import { create } from 'zustand';

interface MockUserState {
  getCustomerName: () => string;
  getCif: () => string;
  getAccountNumber: () => string;
}

interface BreadcrumbSegment {
  label: string;
  path: string;
}

type NavigationRoutes = Record<string, BreadcrumbSegment[]>;

interface NavigationState {
  availableRoutes: NavigationRoutes;
  currentPath: string;
  currentBreadcrumbs: BreadcrumbSegment[];
  setAvailableRoutes: (routes: NavigationRoutes) => void;
  setCurrentPath: (path: string) => void;
  getBreadcrumbs: (path?: string) => BreadcrumbSegment[];
}

const normalizePath = (path: string): string => {
  if (!path) return '/';
  const trimmed = path.trim();
  if (!trimmed || trimmed === '/') return '/';
  const prefixed = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return prefixed.replace(/\/+$/, '') || '/';
};

const computeBreadcrumbs = (path: string, routes: NavigationRoutes): BreadcrumbSegment[] => {
  const normalizedPath = normalizePath(path);

  if (routes[normalizedPath]) {
    return routes[normalizedPath];
  }

  const segments = normalizedPath.split('/').filter(Boolean);

  while (segments.length > 0) {
    segments.pop();
    const candidate = normalizePath(`/${segments.join('/')}`);
    if (routes[candidate]) {
      return routes[candidate];
    }
  }

  return routes['/'] ?? [];
};

export const useUserStore = <T>(selector: (state: MockUserState) => T): T => {
  const mockState: MockUserState = {
    getCustomerName: () => 'Mock Customer',
    getCif: () => '123456789',
    getAccountNumber: () => '987654321'
  };

  return selector(mockState);
};

export const useNavigationStore = create<NavigationState>((set, get) => ({
  availableRoutes: {},
  currentPath: '/',
  currentBreadcrumbs: [],
  setAvailableRoutes: (routes) =>
    set((state) => {
      const normalizedRoutes = Object.keys(routes).reduce<NavigationRoutes>((acc, key) => {
        acc[normalizePath(key)] = routes[key];
        return acc;
      }, {});

      return {
        availableRoutes: normalizedRoutes,
        currentBreadcrumbs: computeBreadcrumbs(state.currentPath, normalizedRoutes)
      };
    }),
  setCurrentPath: (path) =>
    set((state) => {
      const normalized = normalizePath(path);
      return {
        currentPath: normalized,
        currentBreadcrumbs: computeBreadcrumbs(normalized, state.availableRoutes)
      };
    }),
  getBreadcrumbs: (path) => computeBreadcrumbs(path ?? get().currentPath, get().availableRoutes)
}));

export const navigationStore = {
  getState: useNavigationStore.getState,
  setState: useNavigationStore.setState,
  subscribe: useNavigationStore.subscribe
};

export const getNavigationState = () => useNavigationStore.getState();
export const subscribeToNavigation = useNavigationStore.subscribe;

export default {
  useUserStore,
  useNavigationStore,
  navigationStore,
  getNavigationState,
  subscribeToNavigation
};
