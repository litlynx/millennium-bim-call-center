import { describe, expect, it } from 'bun:test';
import { render } from '@testing-library/react';
import TextArea from './TextArea';

describe('TextArea Component', () => {
  it('should be a valid React component', () => {
    // Assert that TextArea is a function (React component)
    expect(typeof TextArea).toBe('function');
  });

  it('should render with basic props', () => {
    // Test that the component renders with basic props
    const { container } = render(
      <TextArea
        title="Test Title"
        placeholder="Enter text..."
        className="custom-class"
        value="test value"
        onChange={() => {}}
      />
    );

    // Assert that the component rendered without errors
    expect(container).toBeTruthy();
  });

  it('should render with validation props', () => {
    // Test rendering with validation props
    const { container } = render(
      <TextArea
        onValidationChange={(_isValid: boolean, _error?: string) => {
          // Mock validation handler
        }}
      />
    );

    // Assert that the component rendered
    expect(container).toBeTruthy();
  });

  it('should render with onChange callback', () => {
    // Test rendering with onChange prop
    const { container } = render(
      <TextArea
        onChange={(_value: string) => {
          // Mock change handler
        }}
      />
    );

    // Assert that the component rendered
    expect(container).toBeTruthy();
  });

  it('should render with clear callback', () => {
    // Test rendering with clear prop
    const { container } = render(
      <TextArea
        onClear={() => {
          // Mock clear handler
        }}
      />
    );

    // Assert that the component rendered
    expect(container).toBeTruthy();
  });

  it('should render with maxLength prop', () => {
    // Test rendering with maxLength prop
    const { container } = render(<TextArea maxLength={100} />);

    // Assert that the component rendered
    expect(container).toBeTruthy();
  });

  it('should render with enableDocuments prop', () => {
    // Test rendering with enableDocuments prop
    const { container } = render(<TextArea enableDocuments={true} />);

    // Assert that the component rendered
    expect(container).toBeTruthy();
  });
});
