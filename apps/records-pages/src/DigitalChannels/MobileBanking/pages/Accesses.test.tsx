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

// Mock react-router
const navigate = mock(() => {});
mock.module('react-router', () => ({
  __esModule: true,
  useNavigate: () => navigate
}));

// Create a mock state for the textarea
let mockTextAreaValue = '';

// Mock the shared components and hooks
mock.module('shared/components', () => ({
  Button: ({
    onClick,
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  PageHeader: ({
    user,
    serviceTitle,
    ...props
  }: {
    user?: any;
    serviceTitle?: string;
    [key: string]: any;
  }) => (
    <div data-testid="page-header-component" {...props}>
      {serviceTitle}
    </div>
  ),
  ScriptDetail: ({ title }: { title?: string }) => <div data-testid="script-detail">{title}</div>,
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
        value={mockTextAreaValue}
        onChange={(e) => {
          mockTextAreaValue = e.target.value;
          onChange?.(e.target.value);
        }}
        {...props}
      />
    </div>
  ),
  useTextAreaWithDocuments: () => ({
    get value() {
      return mockTextAreaValue;
    },
    setValue: (newValue: string) => {
      mockTextAreaValue = newValue;
    },
    clear: () => {
      mockTextAreaValue = '';
    },
    maxLength: 2000,
    onValidationChange: mock(() => {}),
    enableDocuments: true,
    dropzoneProps: {},
    files: [],
    dragActive: false,
    errors: [],
    validateAll: () => mockTextAreaValue.trim().length > 0
  })
}));

import Accesses from 'src/DigitalChannels/MobileBanking/pages/Accesses';

describe('Accesses Page', () => {
  let consoleSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    document.title = '';
    consoleSpy = spyOn(console, 'log').mockImplementation(() => {});
    mockTextAreaValue = ''; // Reset mock state
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

    const textarea = screen.getByTestId('text-area') as HTMLTextAreaElement;

    // Set the value and trigger the change event
    fireEvent.change(textarea, { target: { value: 'Test message' } });

    fireEvent.click(screen.getByRole('button', { name: /Encaminhar/i }));

    expect(consoleSpy).toHaveBeenCalledWith('Sending email to bocanaisremotos@bim.co.mz');
    expect(consoleSpy).toHaveBeenCalledWith('Email content:', 'Test message');
  });

  it('blocks empty email', () => {
    render(<Accesses />);
    fireEvent.click(screen.getByRole('button', { name: /Encaminhar/i }));
    expect(consoleSpy).toHaveBeenCalledWith('Cannot send email: Text area is empty.');
  });

  it('submits valid form', () => {
    render(<Accesses />);

    const textarea = screen.getByTestId('text-area') as HTMLTextAreaElement;

    // Set the value and trigger the change event
    fireEvent.change(textarea, { target: { value: 'Valid form text' } });

    fireEvent.click(screen.getByRole('button', { name: /Fechar/i }));

    expect(navigate).toHaveBeenCalledWith('/vision-360');
  });
  it('validates empty form', () => {
    render(<Accesses />);
    fireEvent.click(screen.getByRole('button', { name: /Fechar/i }));
    expect(consoleSpy).toHaveBeenCalledWith('Form validation failed:', undefined);
  });
});
