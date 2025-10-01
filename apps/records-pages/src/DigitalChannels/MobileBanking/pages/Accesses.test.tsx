import { describe, expect, it } from 'bun:test';
import { render, screen, waitFor } from '@testing-library/react';
import Accesses from './Accesses';

describe('Accesses Page', () => {
  it('sets the document title and renders heading', async () => {
    document.title = 'initial';
    render(<Accesses />);

    await waitFor(() => {
      expect(document.title).toBe('Acessos');
    });

    expect(screen.getByRole('heading', { name: /Acessos Mobile Banking/i })).toBeTruthy();
  });
});
