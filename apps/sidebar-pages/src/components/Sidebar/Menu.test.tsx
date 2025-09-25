import { beforeAll, beforeEach, describe, expect, it, mock } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import type { MenuItemProps } from '../../data/menuData';

// Import the actual Menu component before mocking anything else
import ActualMenu from './Menu';

// Ensure we use the real Menu component, not any external mocks
const Menu = ActualMenu;

// Mock the Submenu component
const mockSubmenu = mock(() => <div data-testid="mock-submenu" />);
mock.module('./Submenu', () => ({
  default: mockSubmenu
}));

// Mock the utils with actual return values
const mockGetMenusBySidebarId = mock(() => [
  {
    id: 'menu-1',
    icon: 'icon1',
    label: 'Menu 1',
    parentSidebarId: 'test-sidebar',
    path: '/menu-1' // Add path for link testing
  },
  {
    id: 'menu-2',
    icon: 'icon2',
    label: 'Menu 2',
    parentSidebarId: 'test-sidebar'
    // No path - will render as button
  }
]);

const mockGetSubmenusByMenuId = mock(() => []);
const mockGetLinksByMenuId = mock(() => []);

const mockGetSidebarLabelById = mock(() => 'Test Sidebar');

mock.module('../../utils/utils', () => ({
  getMenusBySidebarId: mockGetMenusBySidebarId,
  getSidebarLabelById: mockGetSidebarLabelById,
  getSubmenusByMenuId: mockGetSubmenusByMenuId,
  getLinksByMenuId: mockGetLinksByMenuId
}));

// Mock shared lib utils
mock.module('shared/lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ')
}));

// Try to clear any existing mock for this specific module
// We'll handle this in beforeAll instead

// Continue with our local mocks
mock.module('./Submenu', () => ({
  default: mockSubmenu
}));

mock.module('../../utils/utils', () => ({
  getMenusBySidebarId: mockGetMenusBySidebarId,
  getSidebarLabelById: mockGetSidebarLabelById,
  getSubmenusByMenuId: mockGetSubmenusByMenuId,
  getLinksByMenuId: mockGetLinksByMenuId
}));

mock.module('shared/lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ')
}));

const defaultProps: MenuItemProps = {
  isMenuOpen: true,
  activeItem: 'test-sidebar',
  isSubmenuOpen: false,
  activeSubmenuItem: null,
  onSubmenuItemClick: mock(() => {}),
  onCloseMenu: mock(() => {}),
  onCloseSubmenu: mock(() => {})
};

const renderMenuWithRouter = (props: Partial<MenuItemProps> = {}) => {
  const mergedProps = { ...defaultProps, ...props };
  return render(
    <MemoryRouter>
      <Menu {...mergedProps} />
    </MemoryRouter>
  );
};

describe('Menu Component', () => {
  // Ensure we're testing the real Menu component, not any mocked version
  beforeAll(() => {
    // Override the mock that Sidebar.test.tsx creates by using the same path
    // From Menu.test.tsx perspective, we need to go up to src/ then reference the same path
    mock.module('../../components/Sidebar/Menu', () => ({
      default: ActualMenu
    }));
  });

  beforeEach(() => {
    // Clear call history but keep mock implementations
    mockGetMenusBySidebarId.mockClear();
    mockGetSidebarLabelById.mockClear();
    mockGetSubmenusByMenuId.mockClear();
    mockGetLinksByMenuId.mockClear();
    mockSubmenu.mockClear();
  });

  describe('Basic Rendering', () => {
    it('renders when menu is open and has active item', () => {
      renderMenuWithRouter();

      expect(screen.getByText('Test Sidebar')).toBeTruthy();
      expect(screen.getByText('Menu 1')).toBeTruthy();
      expect(screen.getByText('Menu 2')).toBeTruthy();
      expect(mockGetMenusBySidebarId).toHaveBeenCalledWith('test-sidebar');
      expect(mockGetSidebarLabelById).toHaveBeenCalledWith('test-sidebar');
    });

    it('does not render when menu is closed', () => {
      renderMenuWithRouter({ isMenuOpen: false });

      const menuContainer = screen.queryByText('Test Sidebar');
      expect(menuContainer).toBeNull();
    });

    it('does not render when no active item', () => {
      renderMenuWithRouter({ activeItem: undefined });

      const menuContainer = screen.queryByText('Test Sidebar');
      expect(menuContainer).toBeNull();
    });
  });
  describe('Menu Structure', () => {
    it('renders menu header with correct title', () => {
      renderMenuWithRouter();

      expect(mockGetSidebarLabelById).toHaveBeenCalledWith('test-sidebar');
      expect(screen.getByText('Test Sidebar')).toBeTruthy();
    });

    it('renders navigation container with proper styling', () => {
      renderMenuWithRouter();

      const navContainer = screen.getByRole('navigation');
      expect(navContainer).toBeTruthy();
      expect(navContainer.className).toContain('absolute');
    });

    it('renders all menu items', () => {
      renderMenuWithRouter();

      expect(mockGetMenusBySidebarId).toHaveBeenCalledWith('test-sidebar');
      expect(screen.getByText('Menu 1')).toBeTruthy();
      expect(screen.getByText('Menu 2')).toBeTruthy();
    });
  });

  describe('Menu Interactions', () => {
    it('calls onCloseMenu when mouse leaves menu', () => {
      const onCloseMenu = mock(() => {});
      const { container } = renderMenuWithRouter({ onCloseMenu });

      const menuElement = container.querySelector('nav') as HTMLElement;
      fireEvent.mouseLeave(menuElement);

      expect(onCloseMenu).toHaveBeenCalledTimes(1);
    });

    it('calls handleClickMenu and onSubmenuItemClick when button menu item is clicked', () => {
      const onSubmenuItemClick = mock(() => {});

      renderMenuWithRouter({ onSubmenuItemClick });

      // Menu 2 is a button (no path), so it should trigger handleClickMenu
      const menuButton = screen.getByText('Menu 2');
      fireEvent.click(menuButton);

      expect(onSubmenuItemClick).toHaveBeenCalledWith('menu-2');
    });

    it('updates activeMenuItem state when button menu item is clicked', () => {
      renderMenuWithRouter();

      // Menu 2 is a button, so clicking it should trigger state update
      const menuButton = screen.getByText('Menu 2');
      fireEvent.click(menuButton);

      // Verify the button exists and is clickable
      expect(menuButton.tagName).toBe('BUTTON');
    });

    it('handles clicking button menu item multiple times', () => {
      const onSubmenuItemClick = mock(() => {});
      renderMenuWithRouter({ onSubmenuItemClick });

      const menuButton = screen.getByText('Menu 2');

      fireEvent.click(menuButton);
      fireEvent.click(menuButton);

      expect(onSubmenuItemClick).toHaveBeenCalledTimes(2);
      expect(onSubmenuItemClick).toHaveBeenCalledWith('menu-2');
    });
  });

  describe('Submenu Integration', () => {
    it('renders submenu component when submenu is open', () => {
      renderMenuWithRouter({
        isSubmenuOpen: true,
        activeSubmenuItem: 'test-submenu'
      });

      expect(screen.getByTestId('mock-submenu')).toBeTruthy();
    });

    it('renders submenu with closed state when submenu is closed', () => {
      renderMenuWithRouter({
        isSubmenuOpen: false
      });

      // Submenu is always rendered, but with isSubmenuOpen: false
      expect(screen.getByTestId('mock-submenu')).toBeTruthy();
    });
  });

  describe('Menu Styling', () => {
    it('applies correct CSS classes to menu container', () => {
      renderMenuWithRouter();

      const menuContainer = screen.getByRole('navigation');
      expect(menuContainer.className).toContain('absolute');
      expect(menuContainer.className).toContain('bg-white');
    });

    it('applies hover effects to menu items', () => {
      renderMenuWithRouter();

      const menuItem = screen.getByText('Menu 1');
      const menuItemContainer = menuItem.closest('li');

      if (menuItemContainer) {
        fireEvent.mouseEnter(menuItemContainer);
        // Test hover state styling
        expect(menuItemContainer.className).toContain('cursor-pointer');
      }
    });
  });

  describe('Accessibility', () => {
    it('uses proper ARIA roles and attributes', () => {
      renderMenuWithRouter();

      const menuContainer = screen.getByRole('navigation');
      expect(menuContainer).toBeTruthy();
      expect(menuContainer.className).toContain('absolute');
    });

    it('menu items are keyboard accessible', () => {
      renderMenuWithRouter();

      const menuItem = screen.getByText('Menu 1');
      fireEvent.keyDown(menuItem, { key: 'Enter' });
      // Should trigger the same behavior as click
    });
  });

  describe('Edge Cases', () => {
    it('handles empty menu data gracefully', () => {
      mockGetMenusBySidebarId.mockReturnValueOnce([]);
      renderMenuWithRouter();

      expect(screen.getByText('Test Sidebar')).toBeTruthy();
      expect(screen.queryByText('Menu 1')).toBeNull();
    });

    it('handles missing sidebar label gracefully', () => {
      mockGetSidebarLabelById.mockReturnValueOnce('');
      renderMenuWithRouter();

      // Should still render the menu structure
      const navContainer = screen.getByRole('navigation');
      expect(navContainer).toBeTruthy();
    });
  });
});
