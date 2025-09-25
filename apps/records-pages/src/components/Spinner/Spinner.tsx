import * as React from 'react';

export const Spinner: React.FC = () => {
  const titleId = React.useId();
  return (
    <div className="h-16 bg-white flex items-center justify-center">
      <div className="flex items-center gap-2 text-primary-500">
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          role="img"
          aria-labelledby={titleId}
        >
          <title id={titleId}>Loading</title>
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <p className="text-gray">Loading...</p>
      </div>
    </div>
  );
};

export default Spinner;
