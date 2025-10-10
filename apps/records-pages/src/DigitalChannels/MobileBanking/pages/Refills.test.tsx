import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  createSharedComponentsMock,
  registerSharedComponentsMock
} from '../../__mocks__/sharedComponents';

interface QueryState {
  data: unknown;
  isLoading: boolean;
}

const queryState: QueryState = {
  data: {},
  isLoading: false
};

mock.module('@tanstack/react-query', () => ({
  __esModule: true,
  useQuery: () => queryState
}));

// Mock react-router
const navigate = mock(() => {});
mock.module('react-router', () => ({
  __esModule: true,
  useNavigate: () => navigate
}));

const userStore = {
  getCustomerName: () => 'Cliente Teste',
  getCif: () => 'CIF123',
  getAccountNumber: () => 'ACC456'
};

mock.module('shared/stores', () => ({
  __esModule: true,
  useUserStore: (selector: (store: typeof userStore) => unknown) => selector(userStore)
}));

mock.module('shared/stores/index', () => ({
  __esModule: true,
  useUserStore: (selector: (store: typeof userStore) => unknown) => selector(userStore)
}));

mock.module('shared/stores.json', () => ({
  __esModule: true,
  useUserStore: (selector: (store: typeof userStore) => unknown) => selector(userStore)
}));

const resolveSharedComponents = () => createSharedComponentsMock();

registerSharedComponentsMock(resolveSharedComponents);

// Mock the SuccessModal component
mock.module('../components/refills/SuccessModal', () => ({
  __esModule: true,
  default: ({
    isOpen,
    onOpenChange,
    message
  }: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    message: string;
  }) =>
    isOpen ? (
      <div data-testid="success-modal">
        <span>{message}</span>
        <button type="button" onClick={() => onOpenChange(false)}>
          close
        </button>
      </div>
    ) : null
}));

// Mock the table components
mock.module('../components/refills/RefillsTable', () => ({
  __esModule: true,
  RechargesTable: ({ data }: { data: unknown[] }) => (
    <div data-testid="recharges-table">
      <span>Recharges Table</span>
      <span data-testid="recharges-row-count">{data.length}</span>
    </div>
  )
}));

mock.module('../components/refills/CredelecTable', () => ({
  __esModule: true,
  CredelecTable: ({ data }: { data: unknown[] }) => (
    <div data-testid="credelec-table">
      <span>Credelec Table</span>
      <span data-testid="credelec-row-count">{data.length}</span>
    </div>
  )
}));

mock.module('../components/refills/TvPacketsTable', () => ({
  __esModule: true,
  TvPacketsTable: ({ data }: { data: unknown[] }) => (
    <div data-testid="tvpackets-table">
      <span>TV Packets Table</span>
      <span data-testid="tvpackets-row-count">{data.length}</span>
    </div>
  )
}));

const { default: Refills } = await import('./Refills');

const originalConsoleLog = console.log;

const renderRefills = () => {
  return render(<Refills />);
};

describe('Refills Page - Button Group Radio Behavior', () => {
  beforeEach(() => {
    console.log = mock(() => {});
  });

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  describe('Button Group Initialization', () => {
    it('renders all three tab buttons', () => {
      renderRefills();

      const recargasButton = screen.getByRole('button', { name: /recargas/i });
      const credelecButton = screen.getByRole('button', { name: /credelec/i });
      const pacotesTvButton = screen.getByRole('button', { name: /pacotes de tv/i });

      expect(recargasButton).toBeTruthy();
      expect(credelecButton).toBeTruthy();
      expect(pacotesTvButton).toBeTruthy();
    });

    it('initializes with "Recargas" button as active', () => {
      renderRefills();

      const recargasButton = screen.getByRole('button', { name: /recargas/i });

      // Check aria-pressed attribute
      expect(recargasButton.getAttribute('aria-pressed')).toBe('true');

      // Check active styling
      expect(recargasButton.className).toContain('bg-gray-700');
      expect(recargasButton.className).toContain('text-white');
    });

    it('initializes with other buttons as inactive', () => {
      renderRefills();

      const credelecButton = screen.getByRole('button', { name: /credelec/i });
      const pacotesTvButton = screen.getByRole('button', { name: /pacotes de tv/i });

      expect(credelecButton.getAttribute('aria-pressed')).toBe('false');
      expect(pacotesTvButton.getAttribute('aria-pressed')).toBe('false');

      // Should not have active styling
      expect(credelecButton.className).not.toContain('bg-gray-700');
      expect(pacotesTvButton.className).not.toContain('bg-gray-700');
    });

    it('displays the Recharges table by default', () => {
      renderRefills();

      const rechargesTable = screen.getByTestId('recharges-table');
      expect(rechargesTable).toBeTruthy();

      // Other tables should not be visible
      expect(screen.queryByTestId('credelec-table')).toBeFalsy();
      expect(screen.queryByTestId('tvpackets-table')).toBeFalsy();
    });
  });

  describe('Button Click Behavior - Single Selection', () => {
    it('makes Credelec button active when clicked', () => {
      renderRefills();

      const credelecButton = screen.getByRole('button', { name: /credelec/i });

      fireEvent.click(credelecButton);

      expect(credelecButton.getAttribute('aria-pressed')).toBe('true');
      expect(credelecButton.className).toContain('bg-gray-700');
      expect(credelecButton.className).toContain('text-white');
    });

    it('makes Pacotes de TV button active when clicked', () => {
      renderRefills();

      const pacotesTvButton = screen.getByRole('button', { name: /pacotes de tv/i });

      fireEvent.click(pacotesTvButton);

      expect(pacotesTvButton.getAttribute('aria-pressed')).toBe('true');
      expect(pacotesTvButton.className).toContain('bg-gray-700');
      expect(pacotesTvButton.className).toContain('text-white');
    });

    it('deactivates previous button when new button is clicked', () => {
      renderRefills();

      const recargasButton = screen.getByRole('button', { name: /recargas/i });
      const credelecButton = screen.getByRole('button', { name: /credelec/i });

      // Initially Recargas is active
      expect(recargasButton.getAttribute('aria-pressed')).toBe('true');

      // Click Credelec
      fireEvent.click(credelecButton);

      // Recargas should now be inactive
      expect(recargasButton.getAttribute('aria-pressed')).toBe('false');
      expect(recargasButton.className).not.toContain('bg-gray-700');

      // Credelec should be active
      expect(credelecButton.getAttribute('aria-pressed')).toBe('true');
    });

    it('ensures only one button is active at a time', () => {
      renderRefills();

      const recargasButton = screen.getByRole('button', { name: /recargas/i });
      const credelecButton = screen.getByRole('button', { name: /credelec/i });
      const pacotesTvButton = screen.getByRole('button', { name: /pacotes de tv/i });

      // Click through all buttons
      fireEvent.click(credelecButton);

      expect(recargasButton.getAttribute('aria-pressed')).toBe('false');
      expect(credelecButton.getAttribute('aria-pressed')).toBe('true');
      expect(pacotesTvButton.getAttribute('aria-pressed')).toBe('false');

      // Click Pacotes TV
      fireEvent.click(pacotesTvButton);

      expect(recargasButton.getAttribute('aria-pressed')).toBe('false');
      expect(credelecButton.getAttribute('aria-pressed')).toBe('false');
      expect(pacotesTvButton.getAttribute('aria-pressed')).toBe('true');

      // Click back to Recargas
      fireEvent.click(recargasButton);

      expect(recargasButton.getAttribute('aria-pressed')).toBe('true');
      expect(credelecButton.getAttribute('aria-pressed')).toBe('false');
      expect(pacotesTvButton.getAttribute('aria-pressed')).toBe('false');
    });
  });

  describe('Table Display Changes According to Active Button', () => {
    it('displays Recharges table when Recargas button is active', () => {
      renderRefills();

      const recargasButton = screen.getByRole('button', { name: /recargas/i });
      fireEvent.click(recargasButton); // Click to ensure it's active

      expect(screen.getByTestId('recharges-table')).toBeTruthy();
      expect(screen.queryByTestId('credelec-table')).toBeFalsy();
      expect(screen.queryByTestId('tvpackets-table')).toBeFalsy();
    });

    it('switches to Credelec table when Credelec button is clicked', () => {
      renderRefills();

      const credelecButton = screen.getByRole('button', { name: /credelec/i });
      fireEvent.click(credelecButton);

      expect(screen.queryByTestId('recharges-table')).toBeFalsy();
      expect(screen.getByTestId('credelec-table')).toBeTruthy();
      expect(screen.queryByTestId('tvpackets-table')).toBeFalsy();
    });

    it('switches to TV Packets table when Pacotes de TV button is clicked', () => {
      renderRefills();

      const pacotesTvButton = screen.getByRole('button', { name: /pacotes de tv/i });
      fireEvent.click(pacotesTvButton);

      expect(screen.queryByTestId('recharges-table')).toBeFalsy();
      expect(screen.queryByTestId('credelec-table')).toBeFalsy();
      expect(screen.getByTestId('tvpackets-table')).toBeTruthy();
    });

    it('correctly switches between all three tables in sequence', () => {
      renderRefills();

      const recargasButton = screen.getByRole('button', { name: /recargas/i });
      const credelecButton = screen.getByRole('button', { name: /credelec/i });
      const pacotesTvButton = screen.getByRole('button', { name: /pacotes de tv/i });

      // Start with Recargas (default)
      expect(screen.getByTestId('recharges-table')).toBeTruthy();

      // Switch to Credelec
      fireEvent.click(credelecButton);
      expect(screen.getByTestId('credelec-table')).toBeTruthy();
      expect(screen.queryByTestId('recharges-table')).toBeFalsy();

      // Switch to TV Packets
      fireEvent.click(pacotesTvButton);
      expect(screen.getByTestId('tvpackets-table')).toBeTruthy();
      expect(screen.queryByTestId('credelec-table')).toBeFalsy();

      // Switch back to Recargas
      fireEvent.click(recargasButton);
      expect(screen.getByTestId('recharges-table')).toBeTruthy();
      expect(screen.queryByTestId('tvpackets-table')).toBeFalsy();
    });
  });

  describe('Button Click Multiple Times', () => {
    it('keeps button active when clicked multiple times', () => {
      renderRefills();

      const credelecButton = screen.getByRole('button', { name: /credelec/i });

      fireEvent.click(credelecButton);
      expect(credelecButton.getAttribute('aria-pressed')).toBe('true');

      fireEvent.click(credelecButton);
      expect(credelecButton.getAttribute('aria-pressed')).toBe('true');

      fireEvent.click(credelecButton);
      expect(credelecButton.getAttribute('aria-pressed')).toBe('true');
    });

    it('maintains correct table display when same button is clicked multiple times', () => {
      renderRefills();

      const credelecButton = screen.getByRole('button', { name: /credelec/i });

      fireEvent.click(credelecButton);
      expect(screen.getByTestId('credelec-table')).toBeTruthy();

      fireEvent.click(credelecButton);
      expect(screen.getByTestId('credelec-table')).toBeTruthy();

      fireEvent.click(credelecButton);
      expect(screen.getByTestId('credelec-table')).toBeTruthy();
    });
  });

  describe('Accessibility - ARIA Attributes', () => {
    it('sets aria-pressed correctly for all buttons on initialization', () => {
      renderRefills();

      const recargasButton = screen.getByRole('button', { name: /recargas/i });
      const credelecButton = screen.getByRole('button', { name: /credelec/i });
      const pacotesTvButton = screen.getByRole('button', { name: /pacotes de tv/i });

      expect(recargasButton.hasAttribute('aria-pressed')).toBe(true);
      expect(credelecButton.hasAttribute('aria-pressed')).toBe(true);
      expect(pacotesTvButton.hasAttribute('aria-pressed')).toBe(true);
    });

    it('updates aria-pressed when buttons are clicked', () => {
      renderRefills();

      const recargasButton = screen.getByRole('button', { name: /recargas/i });
      const credelecButton = screen.getByRole('button', { name: /credelec/i });

      fireEvent.click(credelecButton);

      expect(recargasButton.getAttribute('aria-pressed')).toBe('false');
      expect(credelecButton.getAttribute('aria-pressed')).toBe('true');
    });
  });

  describe('Button Group Visual States', () => {
    it('applies correct active styling to selected button', () => {
      renderRefills();

      const credelecButton = screen.getByRole('button', { name: /credelec/i });

      fireEvent.click(credelecButton);

      expect(credelecButton.className).toContain('bg-gray-700');
      expect(credelecButton.className).toContain('text-white');
      expect(credelecButton.className).toContain('hover:bg-gray-700');
    });

    it('removes active styling from deselected buttons', () => {
      renderRefills();

      const recargasButton = screen.getByRole('button', { name: /recargas/i });
      const credelecButton = screen.getByRole('button', { name: /credelec/i });

      // Recargas starts active
      expect(recargasButton.className).toContain('bg-gray-700');

      // Click Credelec
      fireEvent.click(credelecButton);

      // Recargas should not have active styling
      expect(recargasButton.className).not.toContain('bg-gray-700');
      expect(recargasButton.className).not.toContain('text-white');
    });
  });

  describe('Integration - Button Group with Filters and Tables', () => {
    it('shows correct filters for Recargas table', () => {
      renderRefills();

      const recargasButton = screen.getByRole('button', { name: /recargas/i });
      fireEvent.click(recargasButton);

      // Check for Recargas-specific filters using getAllByText to handle multiple matches
      expect(screen.getAllByText(/operadora/i)[0]).toBeTruthy();
      expect(screen.getAllByText(/telemóvel do mobile/i)[0]).toBeTruthy();
      expect(screen.getAllByText(/número de destino/i)[0]).toBeTruthy();
    });

    it('shows correct filters for Credelec table', () => {
      renderRefills();

      const credelecButton = screen.getByRole('button', { name: /credelec/i });
      fireEvent.click(credelecButton);

      // Credelec has only phone and date filters (no operator or destination)
      expect(screen.getAllByText(/telemóvel do mobile/i)[0]).toBeTruthy();
      expect(screen.getAllByText(/data/i)[0]).toBeTruthy();
      expect(screen.queryByText(/número de destino/i)).toBeFalsy();
    });

    it('shows correct filters for TV Packets table', () => {
      renderRefills();

      const pacotesTvButton = screen.getByRole('button', { name: /pacotes de tv/i });
      fireEvent.click(pacotesTvButton);

      // TV Packets has operator, phone, and date (no destination)
      expect(screen.getAllByText(/operadora/i)[0]).toBeTruthy();
      expect(screen.getAllByText(/telemóvel do mobile/i)[0]).toBeTruthy();
      expect(screen.getAllByText(/data/i)[0]).toBeTruthy();
      expect(screen.queryByText(/número de destino/i)).toBeFalsy();
    });
  });
});
