import type { BreadcrumbSegment, NavigationRoutes } from '@/stores/navigation';

declare global {
  interface Window {
    microFrontendNavigation?: {
      navigateTo: (path: string) => void;
      getRouteFromTab?: (tab: string) => string;
      getTabFromRoute?: (route: string) => string;
      getAvailableRoutes?: () => NavigationRoutes;
      getCurrentRoute?: () => string;
      getBreadcrumbs?: (path?: string) => BreadcrumbSegment[];
      subscribe?: (
        listener: (payload: {
          currentPath: string;
          breadcrumbs: BreadcrumbSegment[];
          routes: NavigationRoutes;
        }) => void
      ) => () => void;
    };
  }
}
