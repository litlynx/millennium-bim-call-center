import type * as React from 'react';
// Tailwind v3 entry + theme tokens
import './globals.css';

const GlobalStyles: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default GlobalStyles;
