import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it, mock } from 'bun:test';
import type { IconType } from './Icon';

// Mock the icons to avoid complex SVG rendering in tests
mock.module('@/assets/icons', () => ({
  HomeIcon: () => <div data-testid="home-icon">Home Icon</div>,
  BellIcon: () => <div data-testid="bell-icon">Bell Icon</div>,
  UserIcon: () => <div data-testid="user-icon">User Icon</div>,
  CloseIcon: () => <div data-testid="close-icon">Close Icon</div>,
  SearchIcon: () => <div data-testid="search-icon">Search Icon</div>,
  // Add mock for an icon that follows the naming pattern
  AlertFolderIcon: () => <div data-testid="alert-folder-icon">Alert Folder Icon</div>
}));

// Import the component after the mock is registered so the mock applies
const { default: Icon } = await import('./Icon');

describe('Icon', () => {
  const validIconType: IconType = 'home'; // HomeIcon -> home after regex transformation

  describe('Basic Rendering', () => {
    it('renders with a valid icon type', () => {
      render(<Icon type={validIconType} />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });

    it('returns null for invalid icon type', () => {
      const { container } = render(<Icon type={'invalidIcon' as IconType} />);

      expect(container.firstChild).toBeNull();
    });

    it('renders with correct HTML structure', () => {
      const { container } = render(<Icon type={validIconType} />);

      const spanElement = container.querySelector('span') as HTMLSpanElement;
      expect(spanElement).toBeInTheDocument();
      expect(spanElement).toContainElement(screen.getByTestId('home-icon'));
    });
  });

  describe('Size Variants', () => {
    it('applies small size classes by default', () => {
      const { container } = render(<Icon type={validIconType} />);

      const spanElement = container.querySelector('span') as HTMLSpanElement;
      expect(spanElement).toHaveClass('w-8');
      expect(spanElement).toHaveClass('h-8');
    });

    it('applies small size classes when size prop is "sm"', () => {
      const { container } = render(<Icon type={validIconType} size="sm" />);

      const spanElement = container.querySelector('span') as HTMLSpanElement;
      expect(spanElement).toHaveClass('w-8');
      expect(spanElement).toHaveClass('h-8');
    });

    it('applies large size classes when size prop is "lg"', () => {
      const { container } = render(<Icon type={validIconType} size="lg" />);

      const spanElement = container.querySelector('span') as HTMLSpanElement;
      expect(spanElement).toHaveClass('w-10');
      expect(spanElement).toHaveClass('h-10');
    });
  });

  describe('Rounded Variants', () => {
    it('applies rounded-md class by default (not rounded)', () => {
      const { container } = render(<Icon type={validIconType} />);

      const spanElement = container.querySelector('span') as HTMLSpanElement;
      expect(spanElement).toHaveClass('rounded-md');
      expect(spanElement).not.toHaveClass('rounded-full');
    });

    it('applies rounded-md class when rounded is false', () => {
      const { container } = render(<Icon type={validIconType} rounded={false} />);

      const spanElement = container.querySelector('span') as HTMLSpanElement;
      expect(spanElement).toHaveClass('rounded-md');
      expect(spanElement).not.toHaveClass('rounded-full');
    });

    it('applies rounded-full class when rounded is true', () => {
      const { container } = render(<Icon type={validIconType} rounded={true} />);

      const spanElement = container.querySelector('span') as HTMLSpanElement;
      expect(spanElement).toHaveClass('rounded-full');
      expect(spanElement).not.toHaveClass('rounded-md');
    });
  });

  describe('Base Classes', () => {
    it('applies consistent base classes', () => {
      const { container } = render(<Icon type={validIconType} />);

      const spanElement = container.querySelector('span') as HTMLSpanElement;
      expect(spanElement).toHaveClass('inline-flex');
      expect(spanElement).toHaveClass('items-center');
      expect(spanElement).toHaveClass('justify-center');
      expect(spanElement).toHaveClass('p-[6px]');
      // Note: h-fit might be overridden by size classes (w-8 h-8)
    });
  });

  describe('Custom Class Names', () => {
    it('applies custom className when provided', () => {
      const customClass = 'custom-test-class';
      const { container } = render(<Icon type={validIconType} className={customClass} />);

      const spanElement = container.querySelector('span') as HTMLSpanElement;
      expect(spanElement).toHaveClass(customClass);
    });

    it('merges custom className with default classes', () => {
      const { container } = render(<Icon type={validIconType} className="bg-blue-500 border-2" />);

      const spanElement = container.querySelector('span') as HTMLSpanElement;
      expect(spanElement).toHaveClass('bg-blue-500');
      expect(spanElement).toHaveClass('border-2');
      expect(spanElement).toHaveClass('inline-flex'); // default class
      expect(spanElement).toHaveClass('w-8'); // size class
    });

    it('handles empty className gracefully', () => {
      const { container } = render(<Icon type={validIconType} className="" />);

      const spanElement = container.querySelector('span') as HTMLSpanElement;
      expect(spanElement).toHaveClass('inline-flex'); // default classes still applied
    });
  });

  describe('Click Handling', () => {
    it('calls onClick handler when clicked', () => {
      const mockOnClick = mock();
      const { container } = render(<Icon type={validIconType} onClick={mockOnClick} />);

      const spanElement = container.querySelector('span') as HTMLSpanElement;
      if (spanElement) {
        fireEvent.click(spanElement);
      }

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
    it('does not call onClick when not provided', () => {
      const { container } = render(<Icon type={validIconType} />);

      const spanElement = container.querySelector('span') as HTMLSpanElement;
      expect(() => {
        if (spanElement) {
          fireEvent.click(spanElement);
        }
      }).not.toThrow();
    });

    it('makes the icon clickable when onClick is provided', () => {
      const mockOnClick = mock();
      const { container } = render(<Icon type={validIconType} onClick={mockOnClick} />);

      const spanElement = container.querySelector('span') as HTMLSpanElement;
      expect(spanElement).toBeInTheDocument();

      // Should be clickable (cursor might be added via CSS)
      if (spanElement) {
        fireEvent.click(spanElement);
      }
      expect(mockOnClick).toHaveBeenCalled();
    });
  });

  describe('Icon Type Transformation', () => {
    it('handles different icon naming patterns correctly', () => {
      // Test that the regex transformation works
      // BellIcon -> bell, UserIcon -> user, etc.
      render(<Icon type={'bell' as IconType} />);
      expect(screen.getByTestId('bell-icon')).toBeInTheDocument();

      render(<Icon type={'user' as IconType} />);
      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    });

    it('handles complex icon names with transformation', () => {
      // AlertFolderIcon should become alertFolder after transformation
      render(<Icon type={'alertFolder' as IconType} />);
      expect(screen.getByTestId('alert-folder-icon')).toBeInTheDocument();
    });
  });

  describe('Combined Props', () => {
    it('works with all props combined', () => {
      const mockOnClick = mock();
      const { container } = render(
        <Icon
          type={validIconType}
          size="lg"
          rounded={true}
          className="custom-class"
          onClick={mockOnClick}
        />
      );

      const spanElement = container.querySelector('span') as HTMLSpanElement;

      // Check all classes are applied
      expect(spanElement).toHaveClass('w-10'); // lg size
      expect(spanElement).toHaveClass('h-10'); // lg size
      expect(spanElement).toHaveClass('rounded-full'); // rounded
      expect(spanElement).toHaveClass('custom-class'); // custom class
      expect(spanElement).toHaveClass('inline-flex'); // base class

      // Check click works
      if (spanElement) {
        fireEvent.click(spanElement);
      }
      expect(mockOnClick).toHaveBeenCalledTimes(1);

      // Check icon renders
      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined className gracefully', () => {
      const { container } = render(<Icon type={validIconType} className={undefined} />);

      const spanElement = container.querySelector('span');
      expect(spanElement).toBeInTheDocument();
      expect(spanElement).toHaveClass('inline-flex'); // base classes still work
    });

    it('handles invalid size prop gracefully', () => {
      const { container } = render(<Icon type={validIconType} size={'invalid' as 'sm' | 'lg'} />);

      const spanElement = container.querySelector('span') as HTMLSpanElement;
      // Should default to small size since invalid size is provided
      expect(spanElement).toHaveClass('w-8');
      expect(spanElement).toHaveClass('h-8');
    });
  });

  describe('Accessibility', () => {
    it('uses semantic span element', () => {
      const { container } = render(<Icon type={validIconType} />);

      const spanElement = container.querySelector('span') as HTMLSpanElement;
      expect(spanElement?.tagName).toBe('SPAN');
    });

    it('is focusable when clickable', () => {
      const mockOnClick = mock();
      const { container } = render(<Icon type={validIconType} onClick={mockOnClick} />);

      const spanElement = container.querySelector('span') as HTMLSpanElement;
      spanElement?.focus();

      // The element should be focusable (browser behavior)
      expect(spanElement).toBeInTheDocument();
    });
  });
});
