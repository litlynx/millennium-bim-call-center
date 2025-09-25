import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import type { SubmenuItemProps } from '../../data/menuData';
import Submenu from './Submenu';

// Mock the utils with actual return values
const mockGetSubmenusByMenuId = mock(() => [
  {
    id: 'submenu-1',
    label: 'Test Submenu 1',
    parentMenuId: 'menu-1'
  },
  {
    id: 'submenu-2',
    label: 'Test Submenu 2',
    parentMenuId: 'menu-1'
  }
]);

const mockGetSubmenuLinksBySubmenuId = mock((submenuId: string) => {
  if (submenuId === 'submenu-1') {
    return [
      {
        id: 'link-1',
        label: 'Link 1',
        path: '/link-1',
        description: 'Description for Link 1',
        parentSubmenuId: 'submenu-1'
      },
      {
        id: 'link-2',
        label: 'Link 2',
        path: '/link-2',
        parentSubmenuId: 'submenu-1'
      }
    ];
  }
  if (submenuId === 'submenu-2') {
    return [
      {
        id: 'link-3',
        label: 'Link 3',
        path: '/link-3',
        description: 'Description for Link 3',
        parentSubmenuId: 'submenu-2'
      }
    ];
  }
  return [];
});

mock.module('../../utils/utils', () => ({
  getSubmenusByMenuId: mockGetSubmenusByMenuId,
  getSubmenuLinksBySubmenuId: mockGetSubmenuLinksBySubmenuId
}));

const defaultProps: SubmenuItemProps = {
  isSubmenuOpen: true,
  activeMenuItem: 'menu-1',
  onSubmenuItemClick: mock(() => {}),
  onCloseSubmenu: mock(() => {})
};

const renderSubmenuWithRouter = (props: Partial<SubmenuItemProps> = {}) => {
  const mergedProps = { ...defaultProps, ...props };
  return render(
    <MemoryRouter>
      <Submenu {...mergedProps} />
    </MemoryRouter>
  );
};

describe('Submenu Component', () => {
  beforeEach(() => {
    mock.restore();
  });

  describe('Basic Rendering', () => {
    it('renders when submenu is open and has active menu item', () => {
      renderSubmenuWithRouter();

      expect(screen.getByText('Test Submenu 1')).toBeTruthy();
      expect(screen.getByText('Test Submenu 2')).toBeTruthy();
      expect(mockGetSubmenusByMenuId).toHaveBeenCalledWith('menu-1');
    });

    it('does not render when submenu is closed', () => {
      renderSubmenuWithRouter({ isSubmenuOpen: false });

      const submenuContainer = screen.queryByRole('menu');
      expect(submenuContainer).toBeNull();
    });

    it('does not render when no active menu item', () => {
      renderSubmenuWithRouter({ activeMenuItem: undefined });

      const submenuContainer = screen.queryByRole('menu');
      expect(submenuContainer).toBeNull();
    });
  });

  describe('Submenu Structure', () => {
    it('renders submenu container with correct role and attributes', () => {
      renderSubmenuWithRouter();

      const submenuContainer = screen.getByRole('menu');
      expect(submenuContainer).toBeTruthy();
      expect(submenuContainer.getAttribute('tabIndex')).toBe('-1');
    });

    it('renders all submenus with correct labels', () => {
      renderSubmenuWithRouter();

      expect(mockGetSubmenusByMenuId).toHaveBeenCalledWith('menu-1');
      expect(screen.getByText('Test Submenu 1')).toBeTruthy();
      expect(screen.getByText('Test Submenu 2')).toBeTruthy();
    });

    it('renders submenu links with correct content', () => {
      renderSubmenuWithRouter();

      // Links from submenu-1
      expect(screen.getByText('Link 1')).toBeTruthy();
      expect(screen.getByText('Link 2')).toBeTruthy();
      expect(screen.getByText('Description for Link 1')).toBeTruthy();

      // Links from submenu-2
      expect(screen.getByText('Link 3')).toBeTruthy();
      expect(screen.getByText('Description for Link 3')).toBeTruthy();
    });
  });

  describe('Link Interactions', () => {
    it('calls onSubmenuItemClick when link is clicked', () => {
      const onSubmenuItemClick = mock(() => {});
      renderSubmenuWithRouter({ onSubmenuItemClick });

      const link1 = screen.getByText('Link 1');
      fireEvent.click(link1);

      expect(onSubmenuItemClick).toHaveBeenCalledWith('link-1');
    });

    it('handles multiple link clicks correctly', () => {
      const onSubmenuItemClick = mock(() => {});
      renderSubmenuWithRouter({ onSubmenuItemClick });

      const link1 = screen.getByText('Link 1');
      const link2 = screen.getByText('Link 2');

      fireEvent.click(link1);
      fireEvent.click(link2);

      expect(onSubmenuItemClick).toHaveBeenCalledTimes(2);
      expect(onSubmenuItemClick).toHaveBeenNthCalledWith(1, 'link-1');
      expect(onSubmenuItemClick).toHaveBeenNthCalledWith(2, 'link-2');
    });

    it('calls onCloseSubmenu when mouse leaves submenu', () => {
      const onCloseSubmenu = mock(() => {});
      renderSubmenuWithRouter({ onCloseSubmenu });

      const submenuContainer = screen.getByRole('menu');
      fireEvent.mouseLeave(submenuContainer);

      expect(onCloseSubmenu).toHaveBeenCalledTimes(1);
    });
  });

  describe('Navigation', () => {
    it('renders links with correct paths', () => {
      renderSubmenuWithRouter();

      const link1 = screen.getByText('Link 1').closest('a');
      const link2 = screen.getByText('Link 2').closest('a');
      const link3 = screen.getByText('Link 3').closest('a');

      expect(link1?.getAttribute('href')).toBe('/link-1');
      expect(link2?.getAttribute('href')).toBe('/link-2');
      expect(link3?.getAttribute('href')).toBe('/link-3');
    });

    it('applies correct CSS classes to links', () => {
      renderSubmenuWithRouter();

      const link1 = screen.getByText('Link 1').closest('a');
      expect(link1?.className).toContain('group');
      expect(link1?.className).toContain('hover:bg-primary-500');
      expect(link1?.className).toContain('transition-all');
    });
  });

  describe('Description Handling', () => {
    it('renders descriptions when available', () => {
      renderSubmenuWithRouter();

      expect(screen.getByText('Description for Link 1')).toBeTruthy();
      expect(screen.getByText('Description for Link 3')).toBeTruthy();
    });

    it('does not render description when not available', () => {
      renderSubmenuWithRouter();

      // Link 2 doesn't have a description
      const link2Container = screen.getByText('Link 2').closest('a');
      const descriptionSpan = link2Container?.querySelector('span');
      expect(descriptionSpan).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty submenus gracefully', () => {
      mockGetSubmenusByMenuId.mockReturnValueOnce([]);
      renderSubmenuWithRouter();

      const submenuContainer = screen.getByRole('menu');
      expect(submenuContainer).toBeTruthy();

      // Should not have any submenu labels
      expect(screen.queryByText('TEST SUBMENU 1')).toBeNull();
      expect(screen.queryByText('TEST SUBMENU 2')).toBeNull();
    });

    it('handles submenus with no links', () => {
      mockGetSubmenuLinksBySubmenuId.mockImplementation(() => []);
      renderSubmenuWithRouter();

      expect(screen.getByText('Test Submenu 1')).toBeTruthy();
      expect(screen.getByText('Test Submenu 2')).toBeTruthy();

      // Should not have any links
      expect(screen.queryByText('Link 1')).toBeNull();
      expect(screen.queryByText('Link 2')).toBeNull();
      expect(screen.queryByText('Link 3')).toBeNull();
    });

    it('calls utility functions with different menu IDs', () => {
      renderSubmenuWithRouter({ activeMenuItem: 'menu-2' });

      expect(mockGetSubmenusByMenuId).toHaveBeenCalledWith('menu-2');
    });
  });
});
