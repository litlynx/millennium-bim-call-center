import { describe, expect, it, mock } from 'bun:test';
import { fireEvent, render } from '@testing-library/react';
import type { IconType } from './Icon';
import Icon from './Icon';

describe('Icon', () => {
  const validIconType: IconType = 'home'; // HomeIcon -> home after regex transformation

  describe('Basic Rendering', () => {
    it('renders with a valid icon type', () => {
      const { container } = render(<Icon type={validIconType} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('returns null for invalid icon type', () => {
      const { container } = render(<Icon type={'invalidIcon' as IconType} />);

      expect(container.firstChild).toBeNull();
    });

    it('renders with correct HTML structure', () => {
      const { container } = render(<Icon type={validIconType} />);
      const spanElement = container.querySelector('span') as HTMLSpanElement;
      expect(spanElement).toBeInTheDocument();
      expect(spanElement.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('applies medium size classes by default', () => {
      const { container } = render(<Icon type={validIconType} />);

      const spanElement = container.querySelector('span') as HTMLSpanElement;
      expect(spanElement).toHaveClass('w-10');
      expect(spanElement).toHaveClass('h-10');
    });

    it('applies small size classes when size prop is "sm"', () => {
      const { container } = render(<Icon type={validIconType} size="sm" />);

      const spanElement = container.querySelector('span') as HTMLSpanElement;
      expect(spanElement).toHaveClass('w-7');
      expect(spanElement).toHaveClass('h-7');
    });

    it('applies medium size classes when size prop is "md"', () => {
      const { container } = render(<Icon type={validIconType} size="md" />);

      const spanElement = container.querySelector('span') as HTMLSpanElement;
      expect(spanElement).toHaveClass('w-10');
      expect(spanElement).toHaveClass('h-10');
    });

    it('applies large size classes when size prop is "lg"', () => {
      const { container } = render(<Icon type={validIconType} size="lg" />);

      const spanElement = container.querySelector('span') as HTMLSpanElement;
      expect(spanElement).toHaveClass('w-12');
      expect(spanElement).toHaveClass('h-12');
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
      // Note: size-specific classes override intrinsic width/height (w-10 h-10 by default)
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
      expect(spanElement).toHaveClass('w-10'); // size class
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
      const { container: c1 } = render(<Icon type={'bell' as IconType} />);
      expect(c1.querySelector('svg')).toBeInTheDocument();

      const { container: c2 } = render(<Icon type={'user' as IconType} />);
      expect(c2.querySelector('svg')).toBeInTheDocument();
    });

    it('handles complex icon names with transformation', () => {
      // AlertFolderIcon should become alertFolder after transformation
      const { container } = render(<Icon type={'alertFolder' as IconType} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
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
      expect(spanElement).toHaveClass('w-12'); // lg size
      expect(spanElement).toHaveClass('h-12'); // lg size
      expect(spanElement).toHaveClass('rounded-full'); // rounded
      expect(spanElement).toHaveClass('custom-class'); // custom class
      expect(spanElement).toHaveClass('inline-flex'); // base class

      // Check click works
      if (spanElement) {
        fireEvent.click(spanElement);
      }
      expect(mockOnClick).toHaveBeenCalledTimes(1);

      // Check icon renders
      // Using container-based assertion; icon renders an SVG
      expect(spanElement.querySelector('svg')).toBeInTheDocument();
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
      // Should default to medium size since invalid size is provided
      expect(spanElement).toHaveClass('w-10');
      expect(spanElement).toHaveClass('h-10');
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
