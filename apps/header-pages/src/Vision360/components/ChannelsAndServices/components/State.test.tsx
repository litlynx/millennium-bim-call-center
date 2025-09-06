import { render, screen } from '@testing-library/react';
import { type ChannelServiceState, getChannelServiceStateLabel, State } from './State';

describe('State utils', () => {
  test('getChannelServiceStateLabel returns correct labels for all states', () => {
    const cases: Record<ChannelServiceState, string> = {
      A: 'Activo',
      B: 'Bloqueado',
      C: 'Cancelado/Eliminado',
      V: 'Activo para consultas',
      I: 'Inactivo'
    };

    (Object.keys(cases) as ChannelServiceState[]).forEach((state) => {
      expect(getChannelServiceStateLabel(state)).toBe(cases[state]);
    });
  });
});

describe('State component', () => {
  test('renders with default size (md), correct aria attributes and value', () => {
    render(<State value="A" />);
    const badge = screen.getByRole('img');
    expect(badge).toHaveTextContent('A');
    expect(badge).toHaveAttribute('aria-label', expect.stringContaining('Activo (A)'));
    expect(badge).toHaveAttribute('title', expect.stringContaining('Activo (A)'));
    // md preset includes w-6 h-6 text-sm
    expect(badge).toHaveClass('w-6', 'h-6', 'text-sm');
  });

  test('merges custom className with base classes', () => {
    render(<State value="B" className="ml-2 custom" />);
    const badge = screen.getByRole('img');
    expect(badge).toHaveClass('ml-2', 'custom');
    // base classes should remain
    expect(badge).toHaveClass('inline-flex', 'rounded-full', 'border');
  });

  test('supports size presets xs|sm|md|lg|xl', () => {
    const sizes: Array<[Parameters<typeof State>[0]['size'], string[]]> = [
      ['xs', ['w-4', 'h-4', 'text-[10px]']],
      ['sm', ['w-5', 'h-5', 'text-xs']],
      ['md', ['w-6', 'h-6', 'text-sm']],
      ['lg', ['w-8', 'h-8', 'text-base']],
      ['xl', ['w-10', 'h-10', 'text-lg']]
    ];

    sizes.forEach(([size, classes]) => {
      const { getByRole, unmount } = render(<State value="C" size={size} />);
      const badge = getByRole('img');
      classes.forEach((c) => {
        expect(badge).toHaveClass(c);
      });
      unmount();
    });
  });

  test('numeric size maps to md preset', () => {
    render(<State value="V" size={24} />);
    const badge = screen.getByRole('img');
    expect(badge).toHaveClass('w-6', 'h-6', 'text-sm');
  });

  test('title overrides computed label', () => {
    render(<State value="I" title="Custom Label" />);
    const badge = screen.getByRole('img');
    expect(badge).toHaveAttribute('aria-label', 'Custom Label');
    expect(badge).toHaveAttribute('title', 'Custom Label');
  });
});
