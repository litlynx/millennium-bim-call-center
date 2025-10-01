import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Icon } from 'shared/components';
import { cn } from 'shared/lib/utils';
import type { BreadcrumbSegment, NavigationRoutes } from 'shared/stores';
import { navigationStore, useNavigationStore } from 'shared/stores';
import Menu from './components/Sidebar/Menu';
import { bottomSidebarMapData, type SidebarItemProps, sidebarMapData } from './data/menuData';
import { buildNavigationRoutes } from './utils/navigationMap';

type NavigationSubscriptionPayload = {
  currentPath: string;
  breadcrumbs: BreadcrumbSegment[];
  routes: NavigationRoutes;
};

declare global {
  interface Window {
    microFrontendNavigation?: {
      navigateTo: (path: string) => void;
      getRouteFromTab?: (tab: string) => string;
      getTabFromRoute?: (route: string) => string;
      getAvailableRoutes?: () => NavigationRoutes;
      getCurrentRoute?: () => string;
      getBreadcrumbs?: (path?: string) => BreadcrumbSegment[];
      subscribe?: (listener: (payload: NavigationSubscriptionPayload) => void) => () => void;
    };
  }
}

const SidebarItem: React.FC<Omit<SidebarItemProps, 'isActive'>> = ({
  item,
  expanded,
  onOpenMenu,
  onCloseMenu,
  className = '',
  isPendingActive,
  hasMenu
}) => {
  const location = useLocation();

  const isRouteMatch = useMemo(() => {
    const currentPath = location.pathname;

    // Special case: root path with empty id (e.g., localhost:3000 with id="")
    if (currentPath === '/' && (!item.id || item.id === '')) {
      return true;
    }

    // Handle edge cases: empty id or empty path (but not both root + empty id)
    if (!item.id || item.id === '') {
      return false;
    }

    // Normalize paths by removing trailing slashes
    const normalizedCurrentPath = currentPath.replace(/\/+$/, '') || '/';
    const normalizedItemPath = `/${item.id}`.replace(/\/+$/, '') || '/';

    // Exact match for root level items or startsWith for nested routes
    return (
      normalizedCurrentPath === normalizedItemPath ||
      normalizedCurrentPath.startsWith(`${normalizedItemPath}/`)
    );
  }, [location.pathname, item.id]);

  const handleClick = () => {
    if (hasMenu) {
      onOpenMenu(item.id);
      return;
    } else if (onCloseMenu) {
      onCloseMenu();
    }
  };

  const buttonContent = (
    <>
      <Icon
        type={item.icon}
        className={cn(
          'p-0 w-[25px] h-[25px] transition-all duration-300',
          isRouteMatch || isPendingActive ? 'text-white' : 'text-gray-700 group-hover:text-white'
        )}
        size="sm"
      />
      <span
        className={cn(
          'transition-all duration-300 whitespace-nowrap font-medium text-xl',
          isRouteMatch || isPendingActive ? 'text-white' : 'text-gray-800 group-hover:text-white',
          expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        )}
        style={{
          pointerEvents: expanded ? 'auto' : 'none',
          width: expanded ? 'auto' : '0',
          overflow: expanded ? 'visible' : 'hidden'
        }}
      >
        {item.label}
      </span>
    </>
  );

  const commonClassName = cn(
    'flex items-center gap-3 pl-10 pr-7 min-h-[4rem] max-h-[4rem] transition-all duration-300 relative rounded-r-[20px] group text-left cursor-pointer',
    expanded ? 'w-full' : 'w-fit',
    isRouteMatch || isPendingActive
      ? 'bg-primary-500 text-white'
      : 'text-gray-700 hover:bg-primary-500 hover:text-white',
    className
  );

  if (item.path) {
    return (
      <Link
        to={item.path || `/${item.id}`}
        onClick={handleClick}
        className={commonClassName}
        style={{ zIndex: 1 }}
        data-testid={`sidebar-item-${item.id}`}
      >
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={commonClassName}
      style={{ zIndex: 1 }}
      data-testid={`sidebar-item-${item.id}`}
    >
      {buttonContent}
    </button>
  );
};

const SideBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [activeSubmenuItem, setActiveSubmenuItem] = useState<string | null>(null);
  const setAvailableRoutes = useNavigationStore((state) => state.setAvailableRoutes);
  const setCurrentPath = useNavigationStore((state) => state.setCurrentPath);
  const navigationRoutes = useMemo(() => buildNavigationRoutes(), []);

  useEffect(() => {
    setAvailableRoutes(navigationRoutes);
  }, [navigationRoutes, setAvailableRoutes]);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname, setCurrentPath]);

  useEffect(() => {
    const getState = () => navigationStore.getState();

    const subscribe = (listener: (payload: NavigationSubscriptionPayload) => void) => {
      const emit = (path: string) => {
        const state = getState();
        listener({
          currentPath: path,
          breadcrumbs: state.getBreadcrumbs(path),
          routes: state.availableRoutes
        });
      };

      emit(getState().currentPath);

      const unsubscribe = navigationStore.subscribe((state) => {
        emit(state.currentPath);
      });

      return unsubscribe;
    };

    window.microFrontendNavigation = {
      ...window.microFrontendNavigation,
      navigateTo: (path: string) => navigate(path),
      getAvailableRoutes: () => getState().availableRoutes,
      getCurrentRoute: () => getState().currentPath,
      getBreadcrumbs: (path?: string) => getState().getBreadcrumbs(path),
      subscribe
    };

    return () => {
      if (window.microFrontendNavigation?.subscribe === subscribe) {
        const { microFrontendNavigation } = window;
        if (microFrontendNavigation) {
          microFrontendNavigation.subscribe = undefined;
          microFrontendNavigation.getAvailableRoutes = undefined;
          microFrontendNavigation.getCurrentRoute = undefined;
          microFrontendNavigation.getBreadcrumbs = undefined;
        }
      }
    };
  }, [navigate]);

  const handleMouseEnter = () => setExpanded(true);

  const handleMouseLeave = () => {
    setExpanded(false);
    handleCloseMenu();
  };

  const handleOpenMenu = (id: string) => {
    setExpanded(true);
    setActiveItem(id);
    setIsMenuOpen(true);
    setIsSubmenuOpen(false);
    setActiveSubmenuItem(null);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    setActiveItem(null);
    setIsSubmenuOpen(false);
    setActiveSubmenuItem(null);
  };

  const handleSubmenuItemClick = (item: string) => {
    setActiveSubmenuItem(item);
    setIsSubmenuOpen(true);
  };

  const handleCloseOnlyMenu = () => {
    setIsMenuOpen(false);
    setActiveItem(null);
    setIsSubmenuOpen(false);
    setActiveSubmenuItem(null);
  };

  const handleCloseSubmenu = () => {
    setIsSubmenuOpen(false);
    setActiveSubmenuItem(null);
  };

  const handleCloseMenuAndSidebar = () => {
    handleCloseOnlyMenu();
    setExpanded(false);
  };

  return (
    <nav
      // h-[calc(100vh_-_122px_-_72px)]
      className={cn(
        'fixed z-50 h-full justify-between flex flex-col items-center py-3 gap-2 bg-white transition-all duration-300',
        expanded && 'w-72 shadow-[0_4px_4px_0_#00000040] border border-gray-100'
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        minWidth: expanded ? '18rem' : '6.525rem',
        maxWidth: expanded ? '18rem' : '6.525rem'
      }}
    >
      <div className="flex-1 overflow-y-auto min-h-0 w-full flex flex-col overflow-x-hidden">
        {sidebarMapData.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            expanded={expanded}
            onOpenMenu={() => handleOpenMenu(item.id)}
            onCloseMenu={handleCloseMenuAndSidebar}
            isPendingActive={activeItem === item.id}
            hasMenu={!item.path}
          />
        ))}
      </div>

      <div className="flex flex-col w-full" data-testid="sidebar-bottom-section">
        {bottomSidebarMapData.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            expanded={expanded}
            onOpenMenu={() => handleOpenMenu(item.id)}
            onCloseMenu={handleCloseMenuAndSidebar}
            isPendingActive={activeItem === item.id}
            hasMenu={!item.path}
          />
        ))}
      </div>

      <Menu
        isMenuOpen={isMenuOpen}
        activeItem={activeItem}
        isSubmenuOpen={isSubmenuOpen}
        activeSubmenuItem={activeSubmenuItem}
        onSubmenuItemClick={handleSubmenuItemClick}
        onCloseMenu={handleCloseOnlyMenu}
        onCloseSubmenu={handleCloseSubmenu}
      />
    </nav>
  );
};

export default SideBar;
