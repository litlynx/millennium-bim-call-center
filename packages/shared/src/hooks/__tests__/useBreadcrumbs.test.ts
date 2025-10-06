import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import { renderHook } from '@testing-library/react';
import { useBreadcrumbs } from '../useBreadcrumbs';

// Mock window.location
const mockLocation = {
  pathname: '/'
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

// Mock micro frontend navigation API
const mockMenuData = {
  sidebarItems: [
    { id: '', label: 'Início', path: '/' },
    { id: 'records', label: 'Registos' }
  ],
  menuItems: [{ id: 'canais-digitais', label: 'Canais Digitais', parentSidebarId: 'records' }],
  submenuItems: [
    {
      id: 'mobile-banking-submenu',
      label: 'Mobile Banking (IZI/SMART IZI)',
      parentMenuId: 'canais-digitais'
    }
  ],
  submenuLinks: [
    {
      id: 'acessos',
      label: 'Acessos',
      path: '/records/digital-channels/mobile-banking/accesses',
      parentSubmenuId: 'mobile-banking-submenu'
    }
  ]
};

describe('useBreadcrumbs', () => {
  const mockNavigateTo = mock(() => {});

  beforeEach(() => {
    // Setup mock micro frontend navigation
    window.microFrontendNavigation = {
      navigateTo: mockNavigateTo,
      getMenuData: () => mockMenuData
    };
  });

  afterEach(() => {
    window.microFrontendNavigation = undefined;
  });

  it('should return home breadcrumb for root path', () => {
    mockLocation.pathname = '/';

    const { result } = renderHook(() => useBreadcrumbs());

    expect(result.current.breadcrumbs).toEqual([{ label: 'Início', path: '/' }]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return full breadcrumb path for deep nested route', () => {
    mockLocation.pathname = '/records/digital-channels/mobile-banking/accesses';

    const { result } = renderHook(() => useBreadcrumbs());

    expect(result.current.breadcrumbs).toHaveLength(4);
    expect(result.current.breadcrumbs[0]).toEqual({ label: 'Registos', path: '/records' });
    expect(result.current.breadcrumbs[1]).toEqual({
      label: 'Canais Digitais',
      path: '/records/canais-digitais'
    });
    expect(result.current.breadcrumbs[2]).toEqual({
      label: 'Mobile Banking (IZI/SMART IZI)',
      path: '/records/digital-channels/mobile-banking'
    });
    expect(result.current.breadcrumbs[3]).toEqual({
      label: 'Acessos',
      path: '/records/digital-channels/mobile-banking/accesses'
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('should limit breadcrumbs when maxBreadcrumbs is set', () => {
    mockLocation.pathname = '/records/digital-channels/mobile-banking/accesses';

    const { result } = renderHook(() => useBreadcrumbs(undefined, 2));

    expect(result.current.breadcrumbs).toHaveLength(2);
    expect(result.current.breadcrumbs[0]).toEqual({
      label: 'Mobile Banking (IZI/SMART IZI)',
      path: '/records/digital-channels/mobile-banking'
    });
    expect(result.current.breadcrumbs[1]).toEqual({
      label: 'Acessos',
      path: '/records/digital-channels/mobile-banking/accesses'
    });
  });

  it('should fall back to path-based breadcrumbs for unknown routes', () => {
    mockLocation.pathname = '/unknown/route/path';

    const { result } = renderHook(() => useBreadcrumbs());

    expect(result.current.breadcrumbs).toEqual([
      { label: 'Unknown', path: '/unknown' },
      { label: 'Route', path: '/unknown/route' },
      { label: 'Path', path: '/unknown/route/path' }
    ]);
  });

  it('should provide navigation function', () => {
    const { result } = renderHook(() => useBreadcrumbs());

    expect(typeof result.current.navigateTo).toBe('function');

    result.current.navigateTo('/test');
    expect(mockNavigateTo).toHaveBeenCalledWith('/test');
  });
});
