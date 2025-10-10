import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import {
  createSharedComponentsMock,
  registerSharedComponentsMock
} from '../../__mocks__/sharedComponents';
import { mockPrimaryRows } from '../mocks/mockPrimaryRows';
import { mockTransactionRows } from '../mocks/mockTransactionRows';

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

// Create a mock state for the textarea
let mockCancelsBlockedTextAreaValue = '';

// Override the shared components mock to include custom TextArea behavior
const sharedComponentsMock = createSharedComponentsMock();

mock.module('shared/components', () => ({
  ...sharedComponentsMock,
  TextArea: ({
    value,
    onChange,
    ...props
  }: {
    value?: string;
    onChange?: (value: string) => void;
    [key: string]: any;
  }) => (
    <div>
      <textarea
        data-testid="text-area"
        value={mockCancelsBlockedTextAreaValue}
        onChange={(e) => {
          mockCancelsBlockedTextAreaValue = e.target.value;
          onChange?.(e.target.value);
        }}
        {...props}
      />
    </div>
  ),
  useTextAreaWithDocuments: () => ({
    get value() {
      return mockCancelsBlockedTextAreaValue;
    },
    setValue: (newValue: string) => {
      mockCancelsBlockedTextAreaValue = typeof newValue === 'string' ? newValue : String(newValue);
    },
    clear: () => {
      mockCancelsBlockedTextAreaValue = '';
    },
    maxLength: 2000,
    onValidationChange: mock(() => {}),
    enableDocuments: true,
    dropzoneProps: {},
    files: [],
    dragActive: false,
    errors: [],
    validateAll: () => {
      // Simplified validation - just check if we have text
      return mockCancelsBlockedTextAreaValue && mockCancelsBlockedTextAreaValue.trim().length > 0;
    }
  })
}));

mock.module('shared/stores/index', () => ({
  __esModule: true,
  useUserStore: (selector: (store: typeof userStore) => unknown) => selector(userStore)
}));

mock.module('shared/stores.json', () => ({
  __esModule: true,
  useUserStore: (selector: (store: typeof userStore) => unknown) => selector(userStore)
}));

mock.module('src/api/CancelsBlocked/route', () => ({
  __esModule: true,
  GET: mock(async () => ({
    table: mockPrimaryRows,
    transactionHistory: mockTransactionRows,
    script: { title: 'Script', content: 'Detalhes' }
  }))
}));

const resolveSharedComponents = () => createSharedComponentsMock();

registerSharedComponentsMock(resolveSharedComponents);

mock.module('../components/cancelsBlocked/SuccessModal', () => ({
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
      <div data-testid="modal" data-modal-size="sm" className="bg-white text-center">
        <div data-testid="success-modal">
          <span>{message}</span>
          <span data-testid="icon-check" data-icon-type="check" data-size="lg" />
          <button type="button" onClick={() => onOpenChange(false)}>
            close
          </button>
        </div>
      </div>
    ) : null
}));

const { default: CancelsBlocked } = await import('./CancelsBlocked');

const originalConsoleLog = console.log;

const setLoadedData = () => {
  queryState.data = { script: { title: 'Script', content: 'Detalhes' } };
  queryState.isLoading = false;
};

const renderCancelsBlocked = () => render(<CancelsBlocked />);

const getTransactionsRows = () => {
  // Find the tab panel for transaction history
  const tabPanel = screen.getByRole('tabpanel', { name: /Histórico de Transacções/i });
  // Look for table rows within this tab panel
  return within(tabPanel).queryAllByTestId('table-row');
};
const clickIconButton = (testId: string) => {
  const icon = screen.getByTestId(testId);
  const button = icon.closest('button');

  if (!button) {
    throw new Error(`Button not found for test id ${testId}`);
  }

  fireEvent.click(button);
};

beforeEach(() => {
  queryState.data = {};
  queryState.isLoading = false;
  mockCancelsBlockedTextAreaValue = ''; // Reset mock state
});

afterEach(() => {
  console.log = originalConsoleLog;
});

describe('CancelsBlocked Page', () => {
  it('renders fallback when no data is returned', () => {
    queryState.data = undefined;
    queryState.isLoading = false;

    renderCancelsBlocked();

    expect(screen.getByText('Dados não disponíveis')).toBeTruthy();
  });

  it('renders main layout with script detail and tables when data is available', async () => {
    setLoadedData();

    renderCancelsBlocked();

    await waitFor(() => expect(document.title).toBe('Cancelamento/Bloqueio'));

    expect(screen.getByRole('heading', { name: 'Smart IZI - Cancelamento/Bloqueio' })).toBeTruthy();
    expect(screen.getByTestId('script-detail').textContent).toContain('Script');
    expect(screen.getByTestId('card-tabs')).toBeTruthy();

    const tables = screen.getAllByTestId('table');
    expect(tables.length).toBeGreaterThanOrEqual(2);
    expect(within(tables[0]).getAllByTestId('table-row').length).toBeGreaterThan(0);
  });

  it('filters transaction history by contact, status and date range', async () => {
    setLoadedData();

    renderCancelsBlocked();

    await waitFor(() => expect(screen.getByTestId('card-tabs')).toBeTruthy());

    // Initially should have 4 transaction rows (filtered by principal contact '825 816 811')
    await waitFor(() => expect(getTransactionsRows().length).toBe(4));

    const dropdowns = screen.getAllByTestId('button-dropdown');
    const contactContent = within(
      dropdowns[0].querySelector('[data-testid="button-dropdown-content"]') as HTMLElement
    );
    const statusContent = within(
      dropdowns[1].querySelector('[data-testid="button-dropdown-content"]') as HTMLElement
    );

    // Filter by contact '845 816 811' - only has 1 transaction (row-2)
    fireEvent.click(contactContent.getByText('845 816 811'));
    await waitFor(() => expect(getTransactionsRows().length).toBe(1));

    // Filter by status 'Transferência BIM' - row-2 has this status, so still 1
    fireEvent.click(statusContent.getByText('Transferência BIM'));
    await waitFor(() => expect(getTransactionsRows().length).toBe(1));

    // Reset status to 'Todas' - should still show 1 (row-2 for contact '845 816 811')
    fireEvent.click(statusContent.getByText('Todas'));
    await waitFor(() => expect(getTransactionsRows().length).toBe(1));

    // Apply date filter - should show 0 rows (contact '845 816 811' has July dates, outside June range)
    fireEvent.click(screen.getByTestId('date-picker'));
    await waitFor(() => expect(getTransactionsRows().length).toBe(0));

    // Filter by contact '825 816 811' - with date filter active, only row-1 (June 2, 2025) matches
    fireEvent.click(contactContent.getByText('825 816 811'));
    await waitFor(() => expect(getTransactionsRows().length).toBe(1)); // Only row-1 falls within June 1-10 date range
  });

  it('allows cancelling the confirm modal without confirming actions', async () => {
    setLoadedData();

    renderCancelsBlocked();

    await waitFor(() => expect(screen.getByTestId('card-tabs')).toBeTruthy());

    clickIconButton('icon-block');
    expect(screen.getByTestId('modal-title').textContent).toContain('Bloqueio Mobile Banking');

    fireEvent.click(screen.getByText('Cancelar'));

    await waitFor(() => expect(screen.queryByTestId('modal')).toBeNull());
  });

  it('blocks a contract and displays success feedback', async () => {
    setLoadedData();

    renderCancelsBlocked();

    await waitFor(() => expect(screen.getByTestId('card-tabs')).toBeTruthy());

    clickIconButton('icon-block');
    expect(screen.getByTestId('modal-title').textContent).toContain('Bloqueio Mobile Banking');

    fireEvent.click(screen.getByText('Confirmar'));

    const blockSuccessModal = await screen.findByTestId('success-modal');
    expect(blockSuccessModal.textContent).toContain('Contracto bloqueado com sucesso');

    const blockSuccessClose = within(blockSuccessModal).getByRole('button');
    fireEvent.click(blockSuccessClose);

    const inactiveBadges = screen.getAllByTestId('badge-inactive');
    expect(inactiveBadges.length).toBeGreaterThan(0);

    await waitFor(() => expect(screen.queryByTestId('success-modal')).toBeNull());
  });

  it('deletes a contract after confirming fraud and shows success message', async () => {
    setLoadedData();

    renderCancelsBlocked();

    await waitFor(() => expect(screen.getByTestId('card-tabs')).toBeTruthy());

    clickIconButton('icon-trashBin');
    expect(screen.getByTestId('modal-description').textContent).toContain('eliminar');

    fireEvent.click(screen.getByText('Confirmar'));

    await screen.findByText('Pretende cancelar por fraude?');

    fireEvent.click(screen.getByText('Sim'));

    const deleteSuccessModal = await screen.findByTestId('success-modal');
    expect(deleteSuccessModal.textContent).toContain('Contracto cancelado com sucesso');

    const deleteSuccessClose = within(deleteSuccessModal).getByRole('button');
    fireEvent.click(deleteSuccessClose);

    await waitFor(() => expect(screen.queryByTestId('success-modal')).toBeNull());

    expect(screen.queryByTestId('icon-trashBin')).toBeNull();
  });

  it('renders the form with textarea and submit button', async () => {
    render(<CancelsBlocked />);

    await waitFor(() => {
      expect(screen.getByText(/Cancelamento\/Bloqueio/i)).toBeTruthy();
    });

    // Wait for the form to appear
    await waitFor(() => {
      expect(screen.getByTestId('text-area')).toBeTruthy();
    });

    const submitButton = screen.getByRole('button', {
      name: /Submeter Escrito/i
    });

    // Verify form elements exist
    expect(screen.getByTestId('text-area')).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });
});
