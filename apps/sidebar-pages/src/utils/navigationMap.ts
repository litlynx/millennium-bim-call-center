import {
  bottomSidebarMapData,
  menuMapData,
  sidebarMapData,
  submenuLinks,
  submenuMapData
} from '../data/menuData';

type BreadcrumbSegment = {
  label: string;
  path: string;
};

type NavigationRoutes = Record<string, BreadcrumbSegment[]>;

const normalizePath = (path: string): string => {
  if (!path) return '/';
  const trimmed = path.trim();
  if (!trimmed || trimmed === '/') return '/';
  const prefixed = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return prefixed.replace(/\/+$/, '') || '/';
};

const getSidebarItems = () => [...sidebarMapData, ...bottomSidebarMapData];

const addBreadcrumb = (breadcrumbs: BreadcrumbSegment[], crumb: BreadcrumbSegment) => {
  if (!crumb.path) return;
  const normalizedPath = normalizePath(crumb.path);
  if (breadcrumbs.some((item) => normalizePath(item.path) === normalizedPath)) return;
  breadcrumbs.push({ ...crumb, path: normalizedPath });
};

export const buildNavigationRoutes = (): NavigationRoutes => {
  const routes: NavigationRoutes = {};
  const sidebarItems = getSidebarItems();

  sidebarItems
    .filter((item) => item.id && item.id !== '')
    .forEach((item) => {
      const path = normalizePath(item.path ?? `/${item.id}`);
      const breadcrumbs: BreadcrumbSegment[] = [];
      addBreadcrumb(breadcrumbs, { label: item.label, path });
      routes[path] = breadcrumbs;
    });

  menuMapData.forEach((menu) => {
    const sidebar = sidebarItems.find((item) => item.id === menu.parentSidebarId);
    if (!sidebar) return;

    const sidebarPath = normalizePath(sidebar.path ?? `/${sidebar.id}`);
    const menuPathFromConfig = menu.path ? normalizePath(menu.path) : null;
    const menuPath = menuPathFromConfig ?? normalizePath(`${sidebarPath}/${menu.id}`);

    const breadcrumbs: BreadcrumbSegment[] = [];
    addBreadcrumb(breadcrumbs, { label: menu.label, path: menuPath });

    routes[menuPath] = breadcrumbs;
  });

  submenuLinks.forEach((link) => {
    const submenu = submenuMapData.find((item) => item.id === link.parentSubmenuId);
    if (!submenu) return;

    const menu = menuMapData.find((item) => item.id === submenu.parentMenuId);
    if (!menu) return;

    const sidebar = sidebarItems.find((item) => item.id === menu.parentSidebarId);
    if (!sidebar) return;

    const linkPath = normalizePath(link.path);
    const submenuPath = normalizePath(
      `/${linkPath.split('/').filter(Boolean).slice(0, 3).join('/')}`
    );

    const breadcrumbs: BreadcrumbSegment[] = [];
    addBreadcrumb(breadcrumbs, { label: submenu.label, path: submenuPath });
    addBreadcrumb(breadcrumbs, { label: link.label, path: linkPath });

    routes[linkPath] = breadcrumbs;
  });

  return routes;
};
