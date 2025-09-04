import { describe, expect, it, mock } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';
import Input from './Input';

// Mock the Icon component since it's external dependency
mock.module('@/components/Icon', () => ({
  default: function MockIcon({
    type,
    className,
    onClick
  }: {
    type: string;
    className?: string;
    onClick?: () => void;
  }) {
    return (
      <button data-testid={`icon-${type}`} className={className} onClick={onClick} type="button">
        {type} icon
      </button>
    );
  }
}));

describe('Input', () => {
  it('renders input field with default props', () => {
    render(<Input />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('');
  });

  it('renders input field with name and placeholder props', () => {
    const name = 'test-input';
    const placeholder = 'Enter text here';

    render(<Input name={name} placeholder={placeholder} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.name).toBe(name);
    expect(input.placeholder).toBe(placeholder);
  });

  it('updates input value when user types', () => {
    render(<Input />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    const testValue = 'Hello World';

    fireEvent.change(input, { target: { value: testValue } });

    expect(input.value).toBe(testValue);
  });

  it('renders close icon with correct props', () => {
    render(<Input />);

    const icon = screen.getByTestId('icon-closeBlack');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass(
      'cursor-pointer',
      'absolute',
      'h-fit',
      'w-fit',
      'p-0',
      'right-2',
      'top-1/2',
      '-translate-y-1/2'
    );
  });

  it('clears input value when close icon is clicked', () => {
    render(<Input />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    const icon = screen.getByTestId('icon-closeBlack');

    // Type some text first
    const testValue = 'Test text';
    fireEvent.change(input, { target: { value: testValue } });
    expect(input.value).toBe(testValue);

    // Click the close icon
    fireEvent.click(icon);
    expect(input.value).toBe('');
  });

  it('applies correct CSS classes to input', () => {
    render(<Input />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass(
      'bg-gray-100',
      'text-gray-800',
      'text-sm',
      'border-b',
      'border-gray-800',
      'py-2',
      'pl-2',
      'pr-8',
      'w-full'
    );
  });

  it('applies correct CSS classes to container div', () => {
    render(<Input />);

    const container = screen.getByRole('textbox').parentElement;
    expect(container).toHaveClass('relative');
  });

  it('maintains input state across multiple interactions', () => {
    render(<Input />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    const icon = screen.getByTestId('icon-closeBlack');

    // First interaction
    fireEvent.change(input, { target: { value: 'First' } });
    expect(input.value).toBe('First');

    // Clear
    fireEvent.click(icon);
    expect(input.value).toBe('');

    // Second interaction
    fireEvent.change(input, { target: { value: 'Second' } });
    expect(input.value).toBe('Second');

    // Partial clear and retype
    fireEvent.change(input, { target: { value: 'Updated' } });
    expect(input.value).toBe('Updated');
  });

  it('handles empty string input correctly', () => {
    render(<Input />);

    const input = screen.getByRole('textbox') as HTMLInputElement;

    // Set value then clear with typing
    fireEvent.change(input, { target: { value: 'Test' } });
    expect(input.value).toBe('Test');

    fireEvent.change(input, { target: { value: '' } });
    expect(input.value).toBe('');
  });

  it('handles special characters in input', () => {
    render(<Input />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    const specialText = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    fireEvent.change(input, { target: { value: specialText } });
    expect(input.value).toBe(specialText);
  });

  it('preserves input focus behavior', () => {
    render(<Input />);

    const input = screen.getByRole('textbox');

    // Focus the input
    fireEvent.focus(input);

    // Type while focused (focus state is implicitly tested through interaction)
    fireEvent.change(input, { target: { value: 'Focused text' } });
    expect((input as HTMLInputElement).value).toBe('Focused text');

    // Test blur behavior
    fireEvent.blur(input);
    expect((input as HTMLInputElement).value).toBe('Focused text'); // Value should persist after blur
  });

  it('renders without crashing when no props are provided', () => {
    expect(() => render(<Input />)).not.toThrow();
  });

  it('handles rapid state changes correctly', () => {
    render(<Input />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    const icon = screen.getByTestId('icon-closeBlack');

    // Rapid typing and clearing
    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(input.value).toBe('abc');

    fireEvent.click(icon);
    expect(input.value).toBe('');

    fireEvent.change(input, { target: { value: 'xyz' } });
    expect(input.value).toBe('xyz');
  });
});
