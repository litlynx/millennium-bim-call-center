import { useCallback, useEffect, useState } from 'react';
import type {
  BreadcrumbSegment,
  MenuItemInterface,
  SidebarItemInterface,
  SubmenuItemInterface,
  SubmenuLinkItemInterface
} from '@/types';

// Default menu data - this should ideally be provided by the micro-frontend API
const defaultMenuData = {
  sidebarItems: [
    { id: '', label: 'Início', path: '/' },
    { id: 'records', label: 'Registos' }
  ] as SidebarItemInterface[],
  menuItems: [
    { id: 'canais-digitais', label: 'Canais Digitais', parentSidebarId: 'records' }
  ] as MenuItemInterface[],
  submenuItems: [
    {
      id: 'mobile-banking-submenu',
      label: 'Mobile Banking (IZI/SMART IZI)',
      parentMenuId: 'canais-digitais'
    }
  ] as SubmenuItemInterface[],
  submenuLinks: [
    {
      id: 'acessos',
      label: 'Acessos',
      path: '/records/digital-channels/mobile-banking/accesses',
      parentSubmenuId: 'mobile-banking-submenu'
    },
    {
      id: 'cancelamento-bloqueio',
      label: 'Cancelamento/Bloqueio',
      path: '/records/digital-channels/mobile-banking/cancels-blocked',
      parentSubmenuId: 'mobile-banking-submenu'
    }
  ] as SubmenuLinkItemInterface[]
};

interface MenuData {
  sidebarItems: SidebarItemInterface[];
  menuItems: MenuItemInterface[];
  submenuItems: SubmenuItemInterface[];
  submenuLinks: SubmenuLinkItemInterface[];
}

declare global {
  interface Window {
    microFrontendNavigation?: {
      navigateTo: (path: string) => void;
      getBreadcrumbs?: (path?: string) => BreadcrumbSegment[];
      getMenuData?: () => MenuData;
    };
  }
}

/**
 * Custom hook to manage breadcrumbs for navigation
 * Uses sidebar menu data to compute breadcrumbs and supports limiting display to last N items
 * @param fallbackPath - Optional fallback path when window.location is not available
 * @param maxBreadcrumbs - Maximum number of breadcrumbs to show (default: undefined = show all, 2 = show last 2)
 */
export function useBreadcrumbs(
  fallbackPath?: string,
  maxBreadcrumbs?: number
): {
  breadcrumbs: BreadcrumbSegment[];
  isLoading: boolean;
  navigateTo: (path: string) => void;
} {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbSegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(() => {
    return fallbackPath || window.location.pathname;
  });

  const navigateTo = useCallback((path: string) => {
    if (window.microFrontendNavigation?.navigateTo) {
      window.microFrontendNavigation.navigateTo(path);
    } else {
      // Fallback - direct navigation
      window.location.href = path;
    }
  }, []);

  const getCurrentPath = useCallback((): string => {
    return fallbackPath || currentPath;
  }, [fallbackPath, currentPath]);

  // Update current path when window location changes
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    const computeBreadcrumbsFromMenuData = (path: string): BreadcrumbSegment[] => {
      const normalizedPath = path.replace(/\/+$/, '') || '/';

      // Get menu data from micro frontend API or use defaults
      const menuData = window.microFrontendNavigation?.getMenuData?.() || defaultMenuData;
      const { sidebarItems, menuItems, submenuItems, submenuLinks } = menuData;

      // Try to find matching submenu link first (most specific)
      const matchingLink = submenuLinks.find(
        (link: SubmenuLinkItemInterface) => link.path === normalizedPath
      );
      if (matchingLink) {
        const submenu = submenuItems.find(
          (s: SubmenuItemInterface) => s.id === matchingLink.parentSubmenuId
        );
        if (submenu) {
          const menu = menuItems.find((m: MenuItemInterface) => m.id === submenu.parentMenuId);
          if (menu) {
            const sidebar = sidebarItems.find(
              (s: SidebarItemInterface) => s.id === menu.parentSidebarId
            );
            const breadcrumbs: BreadcrumbSegment[] = [];

            // Add sidebar breadcrumb
            if (sidebar) {
              breadcrumbs.push({ label: sidebar.label, path: sidebar.path || `/${sidebar.id}` });
            }

            // Add menu breadcrumb
            breadcrumbs.push({
              label: menu.label,
              path: menu.path || `${sidebar?.path || `/${sidebar?.id}`}/${menu.id}`
            });

            // Add submenu breadcrumb
            breadcrumbs.push({
              label: submenu.label,
              path: normalizedPath.split('/').slice(0, -1).join('/') || '/'
            });

            // Add final link breadcrumb
            breadcrumbs.push({ label: matchingLink.label, path: normalizedPath });

            return breadcrumbs;
          }
        }
      }

      // Try to find matching menu item
      const matchingMenu = menuItems.find(
        (menu: MenuItemInterface) => menu.path === normalizedPath
      );
      if (matchingMenu) {
        const sidebar = sidebarItems.find(
          (s: SidebarItemInterface) => s.id === matchingMenu.parentSidebarId
        );
        const breadcrumbs: BreadcrumbSegment[] = [];

        if (sidebar) {
          breadcrumbs.push({ label: sidebar.label, path: sidebar.path || `/${sidebar.id}` });
        }
        breadcrumbs.push({ label: matchingMenu.label, path: normalizedPath });

        return breadcrumbs;
      }

      // Try to find matching sidebar item
      const matchingSidebar = sidebarItems.find(
        (item: SidebarItemInterface) =>
          item.path === normalizedPath ||
          (item.path === undefined && `/${item.id}` === normalizedPath) ||
          (item.id === '' && normalizedPath === '/')
      );
      if (matchingSidebar) {
        return [{ label: matchingSidebar.label, path: normalizedPath }];
      }

      // Fallback: create breadcrumbs from path segments
      const segments = normalizedPath.split('/').filter(Boolean);
      const breadcrumbs: BreadcrumbSegment[] = [];

      let currentPath = '';
      segments.forEach((segment) => {
        currentPath += `/${segment}`;
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/[-_]/g, ' ');
        breadcrumbs.push({ label, path: currentPath });
      });

      return breadcrumbs;
    };

    const updateBreadcrumbs = () => {
      const currentPath = getCurrentPath();

      // Try to get breadcrumbs from the micro frontend navigation API first
      const apiBreadcrumbs = window.microFrontendNavigation?.getBreadcrumbs?.(currentPath);

      let computedBreadcrumbs: BreadcrumbSegment[];
      if (apiBreadcrumbs && apiBreadcrumbs.length > 0) {
        computedBreadcrumbs = apiBreadcrumbs;
      } else {
        // Use menu-data-based computation
        computedBreadcrumbs = computeBreadcrumbsFromMenuData(currentPath);
      }

      // Limit breadcrumbs if maxBreadcrumbs is specified
      const finalBreadcrumbs =
        maxBreadcrumbs && maxBreadcrumbs > 0
          ? computedBreadcrumbs.slice(-maxBreadcrumbs)
          : computedBreadcrumbs;

      setBreadcrumbs(finalBreadcrumbs);
      setIsLoading(false);
    };

    // Update breadcrumbs when location changes
    updateBreadcrumbs();
  }, [getCurrentPath, maxBreadcrumbs]);

  return {
    breadcrumbs,
    isLoading,
    navigateTo
  };
}
