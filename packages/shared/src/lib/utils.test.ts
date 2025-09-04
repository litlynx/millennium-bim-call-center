import { describe, expect, it } from 'bun:test';
import { cn } from './utils';

describe('cn utility function', () => {
  describe('Basic functionality', () => {
    it('returns empty string when no arguments provided', () => {
      expect(cn()).toBe('');
    });

    it('returns single class when one string provided', () => {
      expect(cn('text-blue-500')).toBe('text-blue-500');
    });

    it('combines multiple string classes', () => {
      const result = cn('text-red-500', 'bg-white', 'p-4');
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-white');
      expect(result).toContain('p-4');
    });

    it('handles undefined and null values gracefully', () => {
      expect(cn('text-blue-500', undefined, 'bg-white', null)).toBe('text-blue-500 bg-white');
    });

    it('handles empty strings', () => {
      expect(cn('text-blue-500', '', 'bg-white')).toBe('text-blue-500 bg-white');
    });
  });

  describe('Conditional classes', () => {
    it('handles boolean conditions', () => {
      const isActive = true;
      const isDisabled = false;

      const result = cn('base-class', isActive && 'active-class', isDisabled && 'disabled-class');

      expect(result).toBe('base-class active-class');
    });

    it('handles object-based conditional classes', () => {
      const result = cn({
        'text-red-500': true,
        'bg-blue-100': false,
        'p-4': true
      });

      expect(result).toBe('text-red-500 p-4');
    });

    it('combines string and conditional classes', () => {
      const isError = true;
      const result = cn('input-base', 'rounded', { 'border-red-500': isError });

      expect(result).toBe('input-base rounded border-red-500');
    });
  });

  describe('Array handling', () => {
    it('handles arrays of classes', () => {
      const classes = ['text-lg', 'font-bold'];
      const result = cn(classes, 'text-center');

      expect(result).toBe('text-lg font-bold text-center');
    });

    it('handles nested arrays', () => {
      const result = cn(['text-lg', ['font-bold', 'text-center']], 'p-4');

      expect(result).toContain('text-lg');
      expect(result).toContain('font-bold');
      expect(result).toContain('text-center');
      expect(result).toContain('p-4');
    });

    it('handles arrays with conditional values', () => {
      const isHighlighted = true;
      const result = cn(['base-class', isHighlighted && 'highlight-class']);

      expect(result).toBe('base-class highlight-class');
    });
  });

  describe('Tailwind CSS conflict resolution', () => {
    it('resolves conflicting padding classes', () => {
      const result = cn('p-2', 'p-4');
      expect(result).toBe('p-4');
    });

    it('resolves conflicting margin classes', () => {
      const result = cn('m-1', 'm-2', 'm-3');
      expect(result).toBe('m-3');
    });

    it('resolves conflicting text color classes', () => {
      const result = cn('text-red-500', 'text-blue-500');
      expect(result).toBe('text-blue-500');
    });

    it('resolves conflicting background color classes', () => {
      const result = cn('bg-red-100', 'bg-blue-200', 'bg-green-300');
      expect(result).toBe('bg-green-300');
    });

    it('keeps non-conflicting classes together', () => {
      const result = cn('text-red-500', 'bg-blue-100', 'text-green-500', 'p-4');
      expect(result).toContain('text-green-500');
      expect(result).toContain('bg-blue-100');
      expect(result).toContain('p-4');
      expect(result).not.toContain('text-red-500');
    });

    it('resolves conflicts with responsive classes', () => {
      const result = cn('p-2', 'md:p-4', 'p-6');
      expect(result).toContain('md:p-4');
      expect(result).toContain('p-6');
      expect(result).not.toContain('p-2');
    });
  });

  describe('Complex scenarios', () => {
    it('handles component-like class merging', () => {
      const baseClasses = 'inline-flex items-center justify-center rounded-md';
      const variantClasses = {
        'bg-blue-500 text-white': true,
        'bg-gray-200 text-gray-900': false
      };
      const sizeClasses = 'h-10 px-4 py-2';
      const customClasses = 'hover:bg-blue-600 focus:outline-none';

      const result = cn(baseClasses, variantClasses, sizeClasses, customClasses);

      expect(result).toContain('inline-flex');
      expect(result).toContain('items-center');
      expect(result).toContain('justify-center');
      expect(result).toContain('rounded-md');
      expect(result).toContain('bg-blue-500');
      expect(result).toContain('text-white');
      expect(result).toContain('h-10');
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
      expect(result).toContain('hover:bg-blue-600');
      expect(result).toContain('focus:outline-none');
      expect(result).not.toContain('bg-gray-200');
      expect(result).not.toContain('text-gray-900');
    });

    it('handles dynamic class combinations with overrides', () => {
      const defaultClasses = 'button-base text-white bg-blue-500';
      const isDisabled = false;
      const isLoading = true;
      const customClasses = 'bg-green-500'; // Should override bg-blue-500

      const result = cn(
        defaultClasses,
        {
          'opacity-50 cursor-not-allowed': isDisabled,
          'cursor-wait': isLoading,
          'hover:bg-blue-600': !isDisabled && !isLoading
        },
        customClasses
      );

      expect(result).toContain('button-base');
      expect(result).toContain('text-white');
      expect(result).toContain('bg-green-500');
      expect(result).toContain('cursor-wait');
      expect(result).not.toContain('bg-blue-500');
      expect(result).not.toContain('opacity-50');
      expect(result).not.toContain('cursor-not-allowed');
      expect(result).not.toContain('hover:bg-blue-600');
    });

    it('handles multiple class types in single call', () => {
      const result = cn(
        'base-class',
        ['array-class-1', 'array-class-2'],
        {
          'conditional-true': true,
          'conditional-false': false
        },
        undefined,
        null,
        '',
        'final-class'
      );

      expect(result).toBe('base-class array-class-1 array-class-2 conditional-true final-class');
    });
  });

  describe('Edge cases', () => {
    it('handles whitespace in class names', () => {
      const result = cn('  spaced-class  ', 'normal-class');
      expect(result).toBe('spaced-class normal-class');
    });

    it('handles duplicate classes', () => {
      const result = cn('duplicate-class', 'other-class', 'duplicate-class');
      // Note: cn doesn't deduplicate identical classes, it only resolves conflicts
      expect(result).toBe('duplicate-class other-class duplicate-class');
    });

    it('handles very long class lists', () => {
      const manyClasses = Array.from({ length: 20 }, (_, i) => `class-${i}`);
      const result = cn(...manyClasses);

      expect(result).toContain('class-0');
      expect(result).toContain('class-19');
      expect(result.split(' ')).toHaveLength(20);
    });

    it('handles special characters in class names', () => {
      const result = cn('w-1/2', 'h-[100px]', 'text-[#ff0000]');
      expect(result).toBe('w-1/2 h-[100px] text-[#ff0000]');
    });

    it('handles numbers and numeric classes', () => {
      const result = cn('z-10', 'order-1', 'col-span-2');
      expect(result).toBe('z-10 order-1 col-span-2');
    });
  });

  describe('Integration with clsx features', () => {
    it('handles template literals', () => {
      const size = 'lg';
      const result = cn(`text-${size}`, 'font-bold');
      expect(result).toBe('text-lg font-bold');
    });

    it('handles mixed argument types', () => {
      const isActive = true;
      const buttonType = 'primary';

      const result = cn(
        'btn',
        `btn-${buttonType}`,
        {
          'btn-active': isActive,
          'btn-disabled': false
        },
        ['additional', 'classes']
      );

      expect(result).toContain('btn');
      expect(result).toContain('btn-primary');
      expect(result).toContain('btn-active');
      expect(result).toContain('additional');
      expect(result).toContain('classes');
      expect(result).not.toContain('btn-disabled');
    });
  });
});
