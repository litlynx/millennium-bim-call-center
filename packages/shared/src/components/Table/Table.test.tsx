import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import { cleanup, render } from '@testing-library/react';
import TableComponent, { type TableRowData } from './Table';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.addEventListener/removeEventListener
const originalAddEventListener = window.addEventListener;
const originalRemoveEventListener = window.removeEventListener;

describe('TableComponent', () => {
  beforeEach(() => {
    // Clean up any previous test state
    cleanup();
  });

  afterEach(() => {
    cleanup();
    // Restore original event listeners
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
  });

  it('should be a valid React component', () => {
    expect(typeof TableComponent).toBe('function');
  });

  it('should render with empty data', () => {
    const headers = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' }
    ];
    const data: TableRowData[] = [];

    const { container } = render(<TableComponent headers={headers} data={data} />);

    expect(container).toBeTruthy();
  });

  it('should render with basic headers and data', () => {
    const headers = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' }
    ];
    const data: TableRowData[] = [
      {
        id: '1',
        cells: [{ content: 'John Doe' }, { content: 'john@example.com' }]
      }
    ];

    const { container, getByText } = render(<TableComponent headers={headers} data={data} />);

    expect(container).toBeTruthy();
    expect(getByText('Name')).toBeTruthy();
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('john@example.com')).toBeTruthy();
  });

  it('should render headers with custom classes', () => {
    const headers = [
      { key: 'name', label: 'Name', className: 'custom-header-class' },
      { key: 'status', label: 'Status', boldColumn: true }
    ];
    const data: TableRowData[] = [];

    const { container } = render(<TableComponent headers={headers} data={data} />);

    expect(container).toBeTruthy();
  });

  it('should render cells with custom classes', () => {
    const headers = [
      { key: 'name', label: 'Name' },
      { key: 'status', label: 'Status' }
    ];
    const data: TableRowData[] = [
      {
        id: '1',
        cells: [{ content: 'John Doe', className: 'custom-cell-class' }, { content: 'Active' }]
      }
    ];

    const { container } = render(<TableComponent headers={headers} data={data} />);

    expect(container).toBeTruthy();
  });

  it('should render rows with custom classes', () => {
    const headers = [{ key: 'name', label: 'Name' }];
    const data: TableRowData[] = [
      {
        id: '1',
        cells: [{ content: 'John Doe' }],
        className: 'custom-row-class'
      }
    ];

    const { container } = render(<TableComponent headers={headers} data={data} />);

    expect(container).toBeTruthy();
  });

  it('should handle multiple rows of data', () => {
    const headers = [
      { key: 'name', label: 'Name' },
      { key: 'age', label: 'Age' }
    ];
    const data: TableRowData[] = [
      {
        id: '1',
        cells: [{ content: 'John Doe' }, { content: '25' }]
      },
      {
        id: '2',
        cells: [{ content: 'Jane Smith' }, { content: '30' }]
      }
    ];

    const { container, getByText } = render(<TableComponent headers={headers} data={data} />);

    expect(container).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Jane Smith')).toBeTruthy();
    expect(getByText('25')).toBeTruthy();
    expect(getByText('30')).toBeTruthy();
  });

  it('should handle ReactNode content in cells', () => {
    const headers = [
      { key: 'name', label: 'Name' },
      { key: 'actions', label: 'Actions' }
    ];
    const data: TableRowData[] = [
      {
        id: '1',
        cells: [{ content: 'John Doe' }, { content: <button type="button">Edit</button> }]
      }
    ];

    const { container, getByText } = render(<TableComponent headers={headers} data={data} />);

    expect(container).toBeTruthy();
    expect(getByText('Edit')).toBeTruthy();
  });

  it('should set up resize event listeners', () => {
    const addEventListenerSpy = mock(() => {});
    const removeEventListenerSpy = mock(() => {});

    window.addEventListener = addEventListenerSpy;
    window.removeEventListener = removeEventListenerSpy;

    const headers = [{ key: 'name', label: 'Name' }];
    const data: TableRowData[] = [];

    const { unmount } = render(<TableComponent headers={headers} data={data} />);

    // Check that resize event listener was added
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    // Unmount and check that event listener was removed
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should handle bold column styling', () => {
    const headers = [
      { key: 'name', label: 'Name', boldColumn: true },
      { key: 'email', label: 'Email' }
    ];
    const data: TableRowData[] = [
      {
        id: '1',
        cells: [{ content: 'John Doe' }, { content: 'john@example.com' }]
      }
    ];

    const { container } = render(<TableComponent headers={headers} data={data} />);

    expect(container).toBeTruthy();
  });
});
