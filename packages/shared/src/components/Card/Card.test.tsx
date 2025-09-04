import { describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Card from './Card';

// Mock the utils function
mock.module('@/lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ')
}));

describe('Card', () => {
  describe('Basic Rendering', () => {
    it('renders without any props', () => {
      const { container } = render(<Card />);

      const card = container.firstChild as HTMLElement;
      expect(card).toBeInTheDocument();
    });

    it('applies default bg-white class', () => {
      const { container } = render(<Card />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-white');
    });

    it('applies custom className along with defaults', () => {
      const { container } = render(<Card className="custom-class" />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('custom-class', 'bg-white');
    });
  });
  describe('Header Section', () => {
    it('renders header when icon is provided', () => {
      render(<Card icon={<span data-testid="test-icon">Icon</span>} />);

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('renders header when title is provided', () => {
      render(<Card title="Test Title" />);

      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('renders header when description is provided', () => {
      render(<Card description="Test Description" />);

      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('does not render header when no icon, title, or description provided', () => {
      const { container } = render(<Card />);

      // Look for CardHeader element (should not exist)
      const header = container.querySelector(
        '[class*="flex"][class*="flex-col"][class*="space-y-1.5"]'
      );
      expect(header).not.toBeInTheDocument();
    });

    it('renders title with correct styling classes', () => {
      render(<Card title="Test Title" />);

      // The title text is inside the CardTitle element which has the styling classes
      const titleText = screen.getByText('Test Title');
      const titleElement = titleText.parentElement; // This should be the CardTitle element

      expect(titleElement?.className).toContain('flex');
      expect(titleElement?.className).toContain('items-center');
      expect(titleElement?.className).toContain('gap-2');
      expect(titleElement?.className).toContain('text-xl');
      expect(titleElement?.className).toContain('font-bold');
    });

    it('renders both icon and title together', () => {
      render(<Card icon={<span data-testid="test-icon">Icon</span>} title="Test Title" />);

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();

      // They should be in the same container
      const titleContainer = screen.getByText('Test Title').parentElement;
      const iconElement = screen.getByTestId('test-icon');
      expect(titleContainer).toContainElement(iconElement);
    });

    it('renders description with correct styling', () => {
      render(<Card description="Test Description" />);

      const description = screen.getByText('Test Description');
      expect(description).toBeInTheDocument();
    });
  });

  describe('Content Section', () => {
    it('renders children when provided', () => {
      render(
        <Card>
          <p data-testid="card-content">Card content here</p>
        </Card>
      );

      expect(screen.getByTestId('card-content')).toBeInTheDocument();
      expect(screen.getByText('Card content here')).toBeInTheDocument();
    });

    it('does not render content section when no children provided', () => {
      const { container } = render(<Card title="Just title" />);

      // Look for CardContent element (should not exist)
      const content = container.querySelector('#card-content');
      expect(content).not.toBeInTheDocument();
    });

    it('applies correct content styling classes', () => {
      render(
        <Card>
          <p>Content</p>
        </Card>
      );

      const contentElement = screen.getByText('Content').parentElement;
      expect(contentElement).toHaveClass('flex-1', 'min-h-0', 'overflow-auto');
    });
  });

  describe('Footer Section', () => {
    it('renders footer when provided', () => {
      render(
        <Card
          footer={
            <button type="button" data-testid="footer-button">
              Click me
            </button>
          }
        />
      );

      expect(screen.getByTestId('footer-button')).toBeInTheDocument();
    });
    it('does not render footer when not provided', () => {
      const { container } = render(<Card title="Just title" />);

      // Look for CardFooter element (should not exist)
      const footer = container.querySelector(
        '[class*="flex"][class*="items-center"][class*="p-6"][class*="pt-0"]'
      );
      expect(footer).not.toBeInTheDocument();
    });
  });

  describe('Complex Combinations', () => {
    it('renders all sections when all props are provided', () => {
      render(
        <Card
          icon={<span data-testid="card-icon">Icon</span>}
          title="Card Title"
          description="Card Description"
          footer={
            <button type="button" data-testid="card-footer">
              Footer
            </button>
          }
        >
          <p data-testid="card-children">Card Content</p>
        </Card>
      );

      expect(screen.getByTestId('card-icon')).toBeInTheDocument();
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card Description')).toBeInTheDocument();
      expect(screen.getByTestId('card-children')).toBeInTheDocument();
      expect(screen.getByTestId('card-footer')).toBeInTheDocument();
    });

    it('handles mixed ReactNode types correctly', () => {
      const complexTitle = (
        <span>
          Complex <strong>Title</strong>
        </span>
      );

      const complexDescription = (
        <div>
          <p>Line 1</p>
          <p>Line 2</p>
        </div>
      );

      render(<Card title={complexTitle} description={complexDescription} />);

      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Line 1')).toBeInTheDocument();
      expect(screen.getByText('Line 2')).toBeInTheDocument();
    });
  });

  describe('Prop Forwarding', () => {
    it('forwards additional props to the root element', () => {
      render(<Card data-testid="custom-card" aria-label="Test card" />);

      const card = screen.getByTestId('custom-card');
      expect(card).toHaveAttribute('aria-label', 'Test card');
    });

    it('handles event handlers correctly', () => {
      const handleClick = mock(() => {});

      render(<Card data-testid="clickable-card" onClick={handleClick} />);

      const card = screen.getByTestId('clickable-card');
      card.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to the root element', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(<Card ref={ref} data-testid="ref-card" />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toBe(screen.getByTestId('ref-card') as HTMLDivElement);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string props gracefully', () => {
      const { container } = render(
        <Card title="" description="" footer="">
          {''}
        </Card>
      );

      // Should still render structure but with empty content
      const card = container.firstChild as HTMLElement;
      expect(card).toBeInTheDocument();
    });

    it('handles null and undefined props gracefully', () => {
      const { container } = render(
        <Card icon={null} title={undefined} description={null} footer={undefined}>
          {null}
        </Card>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toBeInTheDocument();
    });

    it('handles boolean props gracefully', () => {
      const { container } = render(
        <Card
          title={false as unknown as React.ReactNode}
          description={true as unknown as React.ReactNode}
        />
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains proper semantic structure', () => {
      render(
        <Card title="Accessible Card" description="This is an accessible card">
          <p>Content here</p>
        </Card>
      );

      // Check that the structure is logical for screen readers
      const card = screen.getByText('Accessible Card').closest('[class*="bg-white"]');
      expect(card).toBeInTheDocument();

      const title = screen.getByText('Accessible Card');
      const description = screen.getByText('This is an accessible card');
      const content = screen.getByText('Content here');

      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });

    it('supports aria attributes', () => {
      render(<Card aria-label="Custom card label" aria-describedby="card-description" />);

      const card = screen.getByLabelText('Custom card label');
      expect(card).toHaveAttribute('aria-label', 'Custom card label');
      expect(card).toHaveAttribute('aria-describedby', 'card-description');
    });
  });

  describe('CSS Classes', () => {
    it('applies the correct base classes from UICard', () => {
      const { container } = render(<Card />);

      const card = container.firstChild as HTMLElement;
      // These classes come from the UI Card component
      expect(card).toHaveClass(
        'rounded-xl',
        'bg-card',
        'text-card-foreground',
        'flex',
        'flex-col',
        'overflow-hidden',
        'h-full'
      );
    });

    it('preserves custom className priority', () => {
      const { container } = render(<Card className="custom-bg" />);

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('custom-bg');
      expect(card.className).toContain('bg-white');
    });
  });
});
