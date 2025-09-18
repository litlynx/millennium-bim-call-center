import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';

describe('Spinner', () => {
  it('renders loading text and SVG', () => {
    render(<Spinner />);
    expect(screen.getByText('Loading...')).toBeTruthy();
    // Has an SVG with a title for accessibility
    expect(document.querySelector('svg[role="img"] title')?.textContent).toBe('Loading');
  });
});
