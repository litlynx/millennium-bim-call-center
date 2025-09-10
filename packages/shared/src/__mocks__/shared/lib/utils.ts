// Mock implementation for shared/lib/utils
export function cn(...inputs: unknown[]) {
  // Simple mock that just joins class names with spaces, filtering out falsy values
  return inputs
    .filter(Boolean)
    .map((input) =>
      typeof input === 'string'
        ? input
        : typeof input === 'object' && input !== null
          ? Object.keys(input)
              .filter((key) => (input as Record<string, unknown>)[key])
              .join(' ')
          : String(input)
    )
    .join(' ');
}

export default { cn };
