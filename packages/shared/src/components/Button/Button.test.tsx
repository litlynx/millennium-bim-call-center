import { describe, expect, it, mock } from 'bun:test';
import { fireEvent, render } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders with default props', () => {
    const { container } = render(<Button>Click me</Button>);

    const button = container.querySelector('button');
    expect(button).not.toBeNull();
    expect(button?.getAttribute('type')).toBe('button');
    expect(button?.textContent).toBe('Click me');
  });

  it('renders children correctly', () => {
    const buttonText = 'Test Button Text';
    const { container } = render(<Button>{buttonText}</Button>);

    const button = container.querySelector('button');
    expect(button?.textContent).toBe(buttonText);
  });

  it('applies solid variant classes by default', () => {
    const { container } = render(<Button>Solid Button</Button>);

    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-primary-500');
    expect(button?.className).toContain('text-white');
    expect(button?.className).toContain('hover:bg-white');
    expect(button?.className).toContain('hover:text-primary-600');
    expect(button?.className).toContain('w-fit');
  });

  it('applies outline variant classes when variant is outline', () => {
    const { container } = render(<Button variant="outline">Outline Button</Button>);

    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-white');
    expect(button?.className).toContain('text-primary-500');
    expect(button?.className).toContain('hover:bg-primary-500');
    expect(button?.className).toContain('hover:text-white');
  });

  it('applies base classes to both variants', () => {
    const { container } = render(<Button>Base Classes Test</Button>);

    const button = container.querySelector('button');
    expect(button?.className).toContain('px-[1.125rem]');
    expect(button?.className).toContain('py-[0.5625rem]');
    expect(button?.className).toContain('rounded-[1.75rem]');
    expect(button?.className).toContain('border');
    expect(button?.className).toContain('border-primary-500');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-test-class';
    const { container } = render(<Button className={customClass}>Custom Class Button</Button>);

    const button = container.querySelector('button');
    expect(button?.className).toContain(customClass);
  });

  describe('Click Handling', () => {
    it('calls onClick handler when clicked', () => {
      const mockOnClick = mock();
      const { container } = render(<Button onClick={mockOnClick}>Click me</Button>);

      const button = container.querySelector('button') as HTMLButtonElement;
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when not provided', () => {
      // This test ensures no errors occur when onClick is undefined
      const { container } = render(<Button>No Click Handler</Button>);

      const button = container.querySelector('button') as HTMLButtonElement;
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  it('accepts complex children (React nodes)', () => {
    const { container } = render(
      <Button>
        <span>Icon</span>
        <span>Text</span>
      </Button>
    );

    const spans = container.querySelectorAll('span');
    expect(spans[0]?.textContent).toBe('Icon');
    expect(spans[1]?.textContent).toBe('Text');
  });

  it('merges custom className with default classes', () => {
    const { container } = render(
      <Button className="additional-class another-class">Merged Classes</Button>
    );

    const button = container.querySelector('button');
    // Should have both default and custom classes
    expect(button?.className).toContain('additional-class');
    expect(button?.className).toContain('another-class');
    expect(button?.className).toContain('px-[1.125rem]'); // default class
    expect(button?.className).toContain('bg-primary-500'); // variant class
  });

  describe('accessibility', () => {
    it('is focusable', () => {
      const { container } = render(<Button>Focusable Button</Button>);

      const button = container.querySelector('button') as HTMLButtonElement;
      button.focus();

      expect(document.activeElement).toBe(button);
    });

    it('has correct role', () => {
      const { container } = render(<Button>Role Test</Button>);

      const button = container.querySelector('button');
      expect(button).not.toBeNull();
      expect(button?.tagName.toLowerCase()).toBe('button');
    });

    it('has focus outline removed with focus:outline-none class', () => {
      const { container } = render(<Button>Focus Outline Test</Button>);

      const button = container.querySelector('button');
      expect(button?.className).toContain('focus:outline-none');
    });
  });

  describe('variant prop validation', () => {
    it('handles solid variant explicitly', () => {
      const { container } = render(<Button variant="solid">Solid Variant</Button>);

      const button = container.querySelector('button');
      expect(button?.className).toContain('bg-primary-500');
      expect(button?.className).toContain('text-white');
    });

    it('handles outline variant explicitly', () => {
      const { container } = render(<Button variant="outline">Outline Variant</Button>);

      const button = container.querySelector('button');
      expect(button?.className).toContain('bg-white');
      expect(button?.className).toContain('text-primary-500');
    });
  });

  describe('interaction states', () => {
    it('applies hover classes for solid variant', () => {
      const { container } = render(<Button variant="solid">Hover Test Solid</Button>);

      const button = container.querySelector('button');
      expect(button?.className).toContain('hover:bg-white');
      expect(button?.className).toContain('hover:text-primary-600');
    });

    it('applies hover classes for outline variant', () => {
      const { container } = render(<Button variant="outline">Hover Test Outline</Button>);

      const button = container.querySelector('button');
      expect(button?.className).toContain('hover:bg-primary-500');
      expect(button?.className).toContain('hover:text-white');
    });

    it('has transition classes for smooth state changes', () => {
      const { container } = render(<Button>Transition Test</Button>);

      const button = container.querySelector('button');
      expect(button?.className).toContain('transition-colors');
      expect(button?.className).toContain('duration-200');
    });
  });
});
