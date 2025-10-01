import { describe, expect, it } from 'bun:test';
import { render, screen } from '@testing-library/react';

import { PrimaryTable } from 'src/DigitalChannels/MobileBanking/components/cancelsBlocked/PrimaryTable';

const mockData = [
  {
    id: '1',
    operatorName: 'TMcel',
    phoneNumber: '825 816 811',
    type: 'Principal',
    stateSimSwap: 'Desbloqueado',
    badgeText: 'Activo'
  }
];

describe('PrimaryTable', () => {
  it('renders table', () => {
    render(<PrimaryTable data={mockData} />);
    expect(screen.getByTestId('table')).toBeTruthy();
  });

  it('renders with actions', () => {
    render(<PrimaryTable data={mockData} onBlock={() => {}} onDelete={() => {}} />);
    expect(screen.getByTestId('table')).toBeTruthy();
  });
});
