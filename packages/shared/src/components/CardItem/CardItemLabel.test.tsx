import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'bun:test';
import CardItemLabel from './CardItemLabel';

describe('CardItemLabel', () => {
  const defaultProps = {
    title: 'Test Title',
    text: 'Test Text'
  };

  it('renders with required props', () => {
    render(<CardItemLabel {...defaultProps} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Text')).toBeInTheDocument();
  });

  it('renders title with correct styling classes', () => {
    render(<CardItemLabel {...defaultProps} />);

    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toHaveClass('text-xs');
    expect(titleElement).toHaveClass('opacity-55');
    expect(titleElement).toHaveClass('font-semibold');
  });

  it('renders text with correct styling classes', () => {
    render(<CardItemLabel {...defaultProps} />);

    const textElement = screen.getByText('Test Text');
    expect(textElement).toHaveClass('uppercase');
    expect(textElement).toHaveClass('font-semibold');
  });

  it('applies default container classes', () => {
    const { container } = render(<CardItemLabel {...defaultProps} />);

    const wrapperDiv = container.firstChild as HTMLElement;
    expect(wrapperDiv).toHaveClass('text-gray-800');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-test-class';
    const { container } = render(<CardItemLabel {...defaultProps} className={customClass} />);

    const wrapperDiv = container.firstChild as HTMLElement;
    expect(wrapperDiv).toHaveClass(customClass);
    expect(wrapperDiv).toHaveClass('text-gray-800'); // default class should still be present
  });

  it('merges custom className with default classes using cn utility', () => {
    const { container } = render(
      <CardItemLabel {...defaultProps} className="bg-blue-500 custom-spacing" />
    );

    const wrapperDiv = container.firstChild as HTMLElement;
    expect(wrapperDiv).toHaveClass('bg-blue-500');
    expect(wrapperDiv).toHaveClass('custom-spacing');
    expect(wrapperDiv).toHaveClass('text-gray-800');
  });

  it('handles empty strings for title and text', () => {
    const { container } = render(<CardItemLabel title="" text="" />);

    // Elements should still exist but be empty
    const titleElement = container.querySelector('span');
    const textElement = container.querySelector('p');

    expect(titleElement).toBeInTheDocument();
    expect(textElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('');
    expect(textElement).toHaveTextContent('');
  });

  it('handles special characters in title and text', () => {
    const specialTitle = 'Title with @#$%^&*()';
    const specialText = 'Text with éñüñ & special chars!';

    render(<CardItemLabel title={specialTitle} text={specialText} />);

    expect(screen.getByText(specialTitle)).toBeInTheDocument();
    expect(screen.getByText(specialText)).toBeInTheDocument();
  });

  it('handles long strings for title and text', () => {
    const longTitle =
      'This is a very long title that might wrap to multiple lines or cause layout issues';
    const longText =
      'This is a very long text content that should be displayed properly even when it contains many words and might overflow';

    render(<CardItemLabel title={longTitle} text={longText} />);

    expect(screen.getByText(longTitle)).toBeInTheDocument();
    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it('uses semantic HTML structure', () => {
    render(<CardItemLabel {...defaultProps} />);

    // Check that title is in a span element
    const titleElement = screen.getByText('Test Title');
    expect(titleElement.tagName).toBe('SPAN');

    // Check that text is in a paragraph element
    const textElement = screen.getByText('Test Text');
    expect(textElement.tagName).toBe('P');
  });

  it('maintains correct HTML hierarchy', () => {
    const { container } = render(<CardItemLabel {...defaultProps} />);

    const wrapperDiv = container.firstChild as HTMLElement;
    expect(wrapperDiv.tagName).toBe('DIV');

    const spanElement = wrapperDiv.querySelector('span');
    const pElement = wrapperDiv.querySelector('p');

    expect(spanElement).toBeInTheDocument();
    expect(pElement).toBeInTheDocument();
    expect(wrapperDiv).toContainElement(spanElement);
    expect(wrapperDiv).toContainElement(pElement);
  });

  describe('accessibility', () => {
    it('provides readable content for screen readers', () => {
      render(<CardItemLabel title="Account Number" text="1234567890" />);

      // Both title and text should be accessible to screen readers
      expect(screen.getByText('Account Number')).toBeInTheDocument();
      expect(screen.getByText('1234567890')).toBeInTheDocument();
    });

    it('maintains semantic meaning with proper element usage', () => {
      render(<CardItemLabel title="Label" text="Value" />);

      // Title uses span (inline element appropriate for labels)
      const titleElement = screen.getByText('Label');
      expect(titleElement.tagName).toBe('SPAN');

      // Text uses paragraph (block element appropriate for content)
      const textElement = screen.getByText('Value');
      expect(textElement.tagName).toBe('P');
    });
  });

  describe('styling consistency', () => {
    it('applies consistent font-semibold class to both title and text', () => {
      render(<CardItemLabel {...defaultProps} />);

      const titleElement = screen.getByText('Test Title');
      const textElement = screen.getByText('Test Text');

      expect(titleElement).toHaveClass('font-semibold');
      expect(textElement).toHaveClass('font-semibold');
    });

    it('applies different visual hierarchy through size and opacity', () => {
      render(<CardItemLabel {...defaultProps} />);

      const titleElement = screen.getByText('Test Title');
      const textElement = screen.getByText('Test Text');

      // Title should be smaller and less prominent
      expect(titleElement).toHaveClass('text-xs');
      expect(titleElement).toHaveClass('opacity-55');

      // Text should be more prominent without size/opacity restrictions
      expect(textElement).not.toHaveClass('text-xs');
      expect(textElement).not.toHaveClass('opacity-55');
      expect(textElement).toHaveClass('uppercase');
    });
  });
});
