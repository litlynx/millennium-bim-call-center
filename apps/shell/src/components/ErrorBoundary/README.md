# ErrorBoundary for Lazy Components

This module provides a reusable ErrorBoundary component specifically designed for lazy-loaded components in the Millennium BIM Call Center application.

## Overview

The `LazyErrorBoundary` component wraps around lazy-loaded components to catch JavaScript errors and display user-friendly error messages instead of breaking the entire application.

## Features

- 🎯 **Targeted for lazy components**: Specifically designed for React.lazy() components
- 🎨 **User-friendly error UI**: Clean, styled error messages with actionable buttons
- 🎨 **Tailwind CSS styling**: Modern, responsive design using Tailwind CSS classes
- 🔧 **Detailed error information**: Expandable technical details for debugging
- 📊 **Error reporting ready**: Built-in hooks for error tracking services
- ♻️ **Recovery options**: "Try Again" and "Reload Page" buttons
- 🧪 **Fully tested**: Comprehensive test coverage

## Styling

The component uses Tailwind CSS classes for styling, providing:

- **Responsive design**: Works well on all screen sizes
- **Consistent theming**: Follows design system color patterns
- **Interactive elements**: Hover effects and transitions
- **Accessibility**: Proper contrast and focus states

### Tailwind Classes Used

- Layout: `p-5`, `m-5`, `flex`, `gap-2.5`
- Colors: `bg-red-50`, `border-red-400`, `text-pink-700`, `bg-blue-600`
- Typography: `text-xl`, `font-semibold`, `font-sans`
- Interactive: `hover:bg-blue-700`, `cursor-pointer`, `transition-colors`
- Spacing: `mb-2.5`, `mb-4`, `mt-2.5`

## Usage

### Basic Usage

```tsx
import { LazyErrorBoundary } from "./components/ErrorBoundary";

const MyLazyComponent = React.lazy(() => import("./MyComponent"));

function App() {
  return (
    <LazyErrorBoundary componentName="My Component">
      <MyLazyComponent />
    </LazyErrorBoundary>
  );
}
```

### Advanced Usage with Error Handling

```tsx
import { LazyErrorBoundary } from "./components/ErrorBoundary";

const HeaderPages = React.lazy(() => import("headerPages/App"));

function App() {
  return (
    <LazyErrorBoundary
      componentName="Header Pages"
      onError={(error, errorInfo) => {
        // Log to console
        console.error("HeaderPages error:", error, errorInfo);

        // Report to error tracking service
        // Sentry.captureException(error, { extra: errorInfo });
      }}
      onReset={() => {
        // Cleanup logic when user clicks "Try again"
        console.log("Resetting HeaderPages component");
      }}
    >
      <HeaderPages />
    </LazyErrorBoundary>
  );
}
```

## Props

| Prop            | Type                                                 | Default       | Description                         |
| --------------- | ---------------------------------------------------- | ------------- | ----------------------------------- |
| `children`      | `React.ReactNode`                                    | -             | The lazy component to wrap          |
| `componentName` | `string`                                             | `"component"` | Name displayed in error message     |
| `onError`       | `(error: Error, errorInfo: React.ErrorInfo) => void` | -             | Called when an error occurs         |
| `onReset`       | `() => void`                                         | -             | Called when user clicks "Try again" |

## Error UI Features

The error boundary displays:

1. **Clear error message**: "Failed to load [componentName]"
2. **User guidance**: Explains it might be a temporary issue
3. **Technical details**: Expandable section with error message and stack trace
4. **Action buttons**:
   - "Try Again": Resets the error boundary
   - "Reload Page": Refreshes the entire page

## Implementation in Shell.tsx

The ErrorBoundary is currently implemented in the Shell component to wrap the lazy-loaded HeaderPages component:

```tsx
<Route
  path="/*"
  element={
    <LazyErrorBoundary
      componentName="Header Pages"
      onError={(error, errorInfo) => {
        console.error("HeaderPages component error:", error, errorInfo);
      }}
      onReset={() => {
        console.log("Resetting HeaderPages component");
      }}
    >
      <HeaderPages />
    </LazyErrorBoundary>
  }
/>
```

## Testing

The component includes comprehensive tests covering:

- ✅ Normal rendering without errors
- ✅ Error fallback display when component throws
- ✅ Error details visibility
- ✅ Error callback invocation

Run tests with:

```bash
bun run test
```

## Error Reporting Integration

To integrate with error reporting services like Sentry:

```tsx
<LazyErrorBoundary
  componentName="My Component"
  onError={(error, errorInfo) => {
    // Report to Sentry
    Sentry.captureException(error, {
      tags: {
        component: "lazy-component",
        componentName: "My Component",
      },
      extra: errorInfo,
    });
  }}
>
  <MyLazyComponent />
</LazyErrorBoundary>
```

## Best Practices

1. **Always provide componentName**: Makes error messages more helpful
2. **Implement error reporting**: Track errors in production
3. **Add meaningful onReset logic**: Clear any relevant state when resetting
4. **Wrap at the right level**: Don't over-wrap - one boundary per lazy component
5. **Test error scenarios**: Verify error boundaries work in your specific use cases
