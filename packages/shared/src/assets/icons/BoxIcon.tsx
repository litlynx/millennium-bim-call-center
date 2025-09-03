import { useId } from 'react';

export const BoxIcon = () => {
  const titleId = useId();
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={titleId}
    >
      <title id={titleId}>Box icon</title>
      <path
        d="M22.5305 8.49705L12.9996 13.9998L3.46484 8.48828"
        stroke="white"
        strokeWidth="1.81814"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.9995 14V24.227"
        stroke="white"
        strokeWidth="1.81814"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.8643 3.29277C12.5674 2.88679 13.4338 2.88679 14.137 3.29277L21.7053 7.66232C22.4084 8.06829 22.8416 8.81856 22.8416 9.63051V18.3696C22.8416 19.1815 22.4084 19.9318 21.7053 20.3379L14.137 24.7073C13.4338 25.1133 12.5674 25.1133 11.8643 24.7073L4.296 20.3379C3.59283 19.9318 3.15967 19.1815 3.15967 18.3696V9.63051C3.15967 8.81856 3.59283 8.06829 4.296 7.66232L11.8643 3.29277Z"
        stroke="white"
        strokeWidth="1.81814"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.02246 5.47656L17.545 10.5901"
        stroke="white"
        strokeWidth="1.81814"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
