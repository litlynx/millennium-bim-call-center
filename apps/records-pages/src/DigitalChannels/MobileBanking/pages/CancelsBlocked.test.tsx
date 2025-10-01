import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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

mock.module('src/api/CancelsBlocked/route', () => ({
  __esModule: true,
  GET: mock(async () => ({ table: [], transactionHistory: [], script: { title: '', content: '' } }))
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
  const tables = screen.getAllByTestId('table');
  const transactionsTable = tables[tables.length - 1];
  return within(transactionsTable).queryAllByTestId('table-row');
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

    await waitFor(() => expect(getTransactionsRows().length).toBe(2));

    const dropdowns = screen.getAllByTestId('button-dropdown');
    const contactContent = within(
      dropdowns[0].querySelector('[data-testid="button-dropdown-content"]') as HTMLElement
    );
    const statusContent = within(
      dropdowns[1].querySelector('[data-testid="button-dropdown-content"]') as HTMLElement
    );

    fireEvent.click(contactContent.getByText('845 816 811'));
    await waitFor(() => expect(getTransactionsRows().length).toBe(1));

    fireEvent.click(statusContent.getByText('Transferência BIM'));
    await waitFor(() => expect(getTransactionsRows().length).toBe(1));

    fireEvent.click(statusContent.getByText('Todas'));
    await waitFor(() => expect(getTransactionsRows().length).toBe(1));

    fireEvent.click(screen.getByTestId('date-picker'));
    await waitFor(() => expect(getTransactionsRows().length).toBe(0));

    fireEvent.click(contactContent.getByText('825 816 811'));
    await waitFor(() => expect(getTransactionsRows().length).toBe(1));
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

  it('validates the textarea before submitting the form', () => {
    setLoadedData();

    const logSpy = mock((..._args: unknown[]) => {});
    console.log = logSpy as unknown as typeof console.log;

    renderCancelsBlocked();

    const submitButton = screen.getByText('Fechar');
    fireEvent.click(submitButton);

    const logCalls = (logSpy as unknown as { mock: { calls: unknown[][] } }).mock.calls;
    const failureCall = logCalls.find((call) => call[0] === 'Form validation failed:');
    expect(failureCall).toBeTruthy();

    const textArea = screen.getByTestId('text-area') as HTMLTextAreaElement;
    fireEvent.change(textArea, { target: { value: 'Registo válido' } });

    fireEvent.click(submitButton);

    expect(logCalls.some((call) => call[0] === 'Form submitted successfully!')).toBe(true);
    expect(
      logCalls.some((call) => call[0] === 'Text content:' && call[1] === 'Registo válido')
    ).toBe(true);
  });
});
