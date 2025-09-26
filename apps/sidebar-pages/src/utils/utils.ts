import {
  bottomSidebarMapData,
  type MenuItem,
  menuMapData,
  type SubmenuItem,
  type SubmenuLinkItemProps,
  sidebarMapData,
  submenuLinks,
  submenuMapData
} from '../data/menuData';

// Buscar todos os menus de um sidebar
export const getMenusBySidebarId = (sidebarId: string): MenuItem[] => {
  if (!sidebarId) return [];
  return menuMapData.filter((menu) => menu.parentSidebarId === sidebarId.toLowerCase());
};

// Label de um sidebar pelo ID
export const getSidebarLabelById = (id: string): string => {
  if (!id) return '';
  const sidebar = [...sidebarMapData, ...bottomSidebarMapData].find((item) => item.id === id);
  return sidebar?.label || id;
};

// Buscar todos os submenus de um menu
export const getSubmenusByMenuId = (menuId: string): SubmenuItem[] => {
  if (!menuId) return [];
  return submenuMapData.filter((submenu) => submenu.parentMenuId === menuId);
};

// Buscar todos os links de um submenu
export const getSubmenuLinksBySubmenuId = (submenuId: string): SubmenuLinkItemProps[] => {
  if (!submenuId) return [];
  return submenuLinks.filter((link) => link.parentSubmenuId === submenuId);
};
