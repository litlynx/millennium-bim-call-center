import React from 'react';
import './InputWithLabel.css';

export type InputWithLabelProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id?: string;
  labelClassName?: string;
  inputClassName?: string;
  error?: boolean;
  errorMessage?: string;
};

const InputWithLabel = React.forwardRef<HTMLInputElement, InputWithLabelProps>(
  (
    {
      label,
      id = 'input-with-label',
      labelClassName = '',
      inputClassName = '',
      className = '',
      error = false,
      errorMessage,
      ...inputProps
    },
    ref
  ) => {
    const inputHasError = error || Boolean(errorMessage);
    const errorId = `${id}-error`;

    return (
      <div className={`input-with-label ${className}`.trim()}>
        <label className={`input-label ${labelClassName}`.trim()} htmlFor={id}>
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={`input ${inputHasError ? 'error' : ''} ${inputClassName}`.trim()}
          aria-invalid={inputHasError || undefined}
          aria-describedby={inputHasError ? errorId : inputProps['aria-describedby']}
          {...inputProps}
        />
        {inputHasError && (
          <div id={errorId} className="input-error" role="alert" aria-live="polite">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

InputWithLabel.displayName = 'InputWithLabel';

export default InputWithLabel;
