import { describe, expect, it, mock } from 'bun:test';
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { render, screen } from '@testing-library/react';

// Mock the CSS import so Bun doesn't try to load a stylesheet at runtime
mock.module('./globals.css', () => ({}));

// Import after mocking the CSS
import GlobalStyles from './GlobalStyles';

describe('GlobalStyles', () => {
  it('has globals.css present and non-empty', () => {
    const cssUrl = new URL('./globals.css', import.meta.url);
    const cssPath = fileURLToPath(cssUrl);
    expect(existsSync(cssPath)).toBe(true);
    const stats = statSync(cssPath);
    expect(stats.isFile()).toBe(true);
    expect(stats.size).toBeGreaterThan(0);
  });

  it('renders children', () => {
    render(
      <GlobalStyles>
        <div data-testid="content">Hello</div>
      </GlobalStyles>
    );

    expect(screen.getByTestId('content')).toHaveTextContent('Hello');
  });

  it('renders without children', () => {
    const { container } = render(<GlobalStyles />);
    // Fragment with no children should render nothing
    expect(container.firstChild).toBeNull();
  });

  it('does not wrap children in an extra element', () => {
    const { container } = render(
      <GlobalStyles>
        <span data-testid="child">Text</span>
      </GlobalStyles>
    );

    // The first child should be exactly our span, not an extra wrapper
    const child = screen.getByTestId('child');
    expect(container.firstChild).toBe(child);
    expect(child).toHaveTextContent('Text');
  });

  it('supports multiple and nested children', () => {
    render(
      <GlobalStyles>
        <div data-testid="one">One</div>
        <div>
          <span data-testid="two">Two</span>
        </div>
      </GlobalStyles>
    );

    expect(screen.getByTestId('one')).toHaveTextContent('One');
    expect(screen.getByTestId('two')).toHaveTextContent('Two');
  });
});
