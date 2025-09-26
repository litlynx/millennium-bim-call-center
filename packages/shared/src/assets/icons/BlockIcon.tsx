import { useId } from 'react';

export const BlockIcon = () => {
  const titleId = useId();
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-labelledby={titleId}>
      <title id={titleId}>Block icon</title>
      <path d="M9.7739 18.4912C14.4643 18.4912 18.2665 14.6889 18.2665 9.99851C18.2665 5.30815 14.4643 1.50586 9.7739 1.50586C5.08354 1.50586 1.28125 5.30815 1.28125 9.99851C1.28125 14.6889 5.08354 18.4912 9.7739 18.4912Z" stroke="#D1005D" stroke-width="1.54957" stroke-miterlimit="10"/>
      <path d="M16.308 4.17383L3.94922 16.5327" stroke="#D1005D" stroke-width="1.54485" stroke-miterlimit="10"/>
    </svg>
  );
};
