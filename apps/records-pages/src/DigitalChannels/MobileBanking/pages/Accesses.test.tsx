import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';

// Simple, stable mocks
mock.module('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: { table: [], script: { title: 'Mock Script', content: 'Mock content' } },
    isLoading: false,
    error: null
  })
}));

mock.module('react-helmet', () => ({
  Helmet: ({ children }: { children: React.ReactNode }) => children
}));

import Accesses from 'src/DigitalChannels/MobileBanking/pages/Accesses';

describe('Accesses Page', () => {
  let consoleSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    document.title = '';
    consoleSpy = spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders main interface', () => {
    render(<Accesses />);

    expect(screen.getByText(/Smart IZI - Acessos/i)).toBeTruthy();
    expect(screen.getByTestId('script-detail')).toBeTruthy();
    expect(screen.getByPlaceholderText(/Motivo da Chamada/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Encaminhar/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Fechar/i })).toBeTruthy();
  });

  it('sets document title', () => {
    render(<Accesses />);
    expect(document.title).toBe('Acessos');
  });

  it('sends email with valid content', () => {
    render(<Accesses />);

    const textarea = screen.getByPlaceholderText(/Motivo da Chamada/i);
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    fireEvent.click(screen.getByRole('button', { name: /Encaminhar/i }));

    expect(consoleSpy).toHaveBeenCalledWith(
      'Sending email to bocanaisremotos@bim.co.mz',
      'Test message'
    );
  });

  it('blocks empty email', () => {
    render(<Accesses />);
    fireEvent.click(screen.getByRole('button', { name: /Encaminhar/i }));
    expect(consoleSpy).toHaveBeenCalledWith('Cannot send email: Text area is empty.');
  });

  it('submits valid form', () => {
    render(<Accesses />);

    const textarea = screen.getByPlaceholderText(/Motivo da Chamada/i);
    fireEvent.change(textarea, { target: { value: 'Valid content' } });
    fireEvent.click(screen.getByRole('button', { name: /Fechar/i }));

    expect(consoleSpy).toHaveBeenCalledWith('Form submitted successfully!');
  });

  it('validates empty form', () => {
    render(<Accesses />);
    fireEvent.click(screen.getByRole('button', { name: /Fechar/i }));
    expect(consoleSpy).toHaveBeenCalledWith('Form validation failed:', null);
  });
});
