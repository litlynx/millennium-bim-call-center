import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner Component', () => {
  it('should render the spinner with loading text', () => {
    // Act
    render(<Spinner />);

    // Assert
    expect(screen.getByText('Loading...')).toBeDefined();
    expect(screen.getByRole('img')).toBeDefined();
  });

  it('should have proper accessibility attributes', () => {
    // Act
    render(<Spinner />);

    // Assert
    const svg = screen.getByRole('img');
    expect(svg).toBeDefined();
    expect(svg.getAttribute('aria-labelledby')).toBeTruthy();

    // Check that title element exists and has the correct text
    const title = screen.getByText('Loading', { selector: 'title' });
    expect(title).toBeDefined();

    // Check that the SVG is properly labeled by the title
    const titleId = title.getAttribute('id');
    expect(svg.getAttribute('aria-labelledby')).toBe(titleId);
  });

  it('should render with correct CSS classes for styling', () => {
    // Act
    const { container } = render(<Spinner />);

    // Assert
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv.className).toContain('h-16');
    expect(mainDiv.className).toContain('bg-white');
    expect(mainDiv.className).toContain('flex');
    expect(mainDiv.className).toContain('items-center');
    expect(mainDiv.className).toContain('justify-center');
  });

  it('should have animated SVG with proper classes', () => {
    // Act
    render(<Spinner />);

    // Assert
    const svg = screen.getByRole('img');
    expect(svg.className).toContain('animate-spin');
    expect(svg.className).toContain('h-4');
    expect(svg.className).toContain('w-4');
  });

  it('should render SVG with correct viewBox and structure', () => {
    // Act
    render(<Spinner />);

    // Assert
    const svg = screen.getByRole('img');
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');

    // Check that SVG contains circle and path elements
    const circle = svg.querySelector('circle');
    const path = svg.querySelector('path');

    expect(circle).toBeDefined();
    expect(path).toBeDefined();

    if (circle) {
      expect(circle.getAttribute('cx')).toBe('12');
      expect(circle.getAttribute('cy')).toBe('12');
      expect(circle.getAttribute('r')).toBe('10');
      expect(circle.className).toContain('opacity-25');
    }

    if (path) {
      expect(path.className).toContain('opacity-75');
    }
  });

  it('should maintain unique IDs across multiple instances', () => {
    // Act
    const { container: container1 } = render(<Spinner />);
    const { container: container2 } = render(<Spinner />);

    // Assert
    const svg1 = container1.querySelector('svg');
    const svg2 = container2.querySelector('svg');
    const title1 = container1.querySelector('title');
    const title2 = container2.querySelector('title');

    expect(svg1?.getAttribute('aria-labelledby')).not.toBe(svg2?.getAttribute('aria-labelledby'));
    expect(title1?.getAttribute('id')).not.toBe(title2?.getAttribute('id'));
  });

  it('should render the loading text with correct styling', () => {
    // Act
    render(<Spinner />);

    // Assert
    const loadingText = screen.getByText('Loading...');
    expect(loadingText.tagName).toBe('P');
    expect(loadingText.className).toContain('text-gray');
  });

  it('should have a container with primary color styling', () => {
    // Act
    const { container } = render(<Spinner />);

    // Assert
    const colorContainer = container.querySelector('.text-primary-500');
    expect(colorContainer).toBeDefined();
    expect(colorContainer?.className).toContain('flex');
    expect(colorContainer?.className).toContain('items-center');
    expect(colorContainer?.className).toContain('gap-2');
  });
});
