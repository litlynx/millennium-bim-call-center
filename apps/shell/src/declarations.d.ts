// Import shared component declarations
/// <reference path="../../../packages/@config/webpack-config/shared-components.d.ts" />

// to be able to import jpg/jpeg/png files
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';
declare module '*.svg';

// CSS Modules typings
declare module '*.module.css' {
  const classes: { [className: string]: string };
  export default classes;
}

// Global CSS imports (side-effectful CSS like Tailwind)
declare module '*.css' {
  const content: string;
  export default content;
}

// to be able to import CSS files as strings (for regular CSS imports)
declare module '*.css?raw' {
  const content: string;
  export default content;
}

// Remote module declarations are provided by .wp_federation generated types via tsconfig paths
