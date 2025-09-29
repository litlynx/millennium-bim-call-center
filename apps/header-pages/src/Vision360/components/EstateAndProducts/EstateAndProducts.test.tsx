import { describe, expect, test } from 'bun:test';
import { renderWithProviders } from 'src/__tests__/testUtils';
import EstateAndProducts from './EstateAndProducts';

describe('EstateAndProducts', () => {
  test('renders without crashing', () => {
    const { container } = renderWithProviders(<EstateAndProducts />);
    expect(container).toBeTruthy();
  });
});
