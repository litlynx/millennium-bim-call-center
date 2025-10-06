export interface SidebarItemInterface {
  id: string;
  label: string;
  path?: string;
}

export interface MenuItemInterface {
  id: string;
  label: string;
  parentSidebarId: string;
  path?: string;
}

export interface SubmenuItemInterface {
  id: string;
  label: string;
  parentMenuId: string;
}

export interface SubmenuLinkItemInterface {
  id: string;
  label: string;
  path: string;
  parentSubmenuId: string;
}

export interface BreadcrumbSegment {
  label: string;
  path: string;
}

export type NavigationRoutes = Record<string, BreadcrumbSegment[]>;
