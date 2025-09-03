import * as React from 'react';

export const AlertFolderIcon: React.FC = () => {
  const titleId = React.useId();
  const clipId = React.useId();
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={titleId}
    >
      <title id={titleId}>Alert folder</title>
      <g clipPath={`url(#${clipId})`}>
        <path d="M10.0898 10.2324V16.9124" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" />
        <path
          d="M20.59 22.643H3.41C2.90425 22.6404 2.41996 22.4383 2.06233 22.0807C1.7047 21.7231 1.50263 21.2388 1.5 20.733V7.37305H18.68V20.733C18.6826 21.2388 18.8847 21.7231 19.2423 22.0807C19.6 22.4383 20.0842 22.6404 20.59 22.643Z"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
        />
        <path
          d="M22.5003 3.55258V20.7326C22.5003 21.2391 22.2991 21.725 21.9409 22.0832C21.5827 22.4413 21.0969 22.6426 20.5903 22.6426C20.0837 22.6426 19.5979 22.4413 19.2397 22.0832C18.8815 21.725 18.6803 21.2391 18.6803 20.7326V7.37258H5.32031V1.64258H14.8603L16.7303 3.55258H22.5003Z"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
        />

        <path d="M9.13965 18.8223H11.0496" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="24" height="24" fill="white" transform="translate(0 0.142578)" />
        </clipPath>
      </defs>
    </svg>
  );
};
