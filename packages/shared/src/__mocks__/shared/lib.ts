export const cn = (...inputs: unknown[]) =>
  (inputs as unknown[]).flat().filter(Boolean).map(String).join(' ');
