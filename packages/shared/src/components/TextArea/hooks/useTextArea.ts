// Hook for integrating TextArea with forms
import { useCallback, useState } from 'react';
import { z } from 'zod';

interface UseTextAreaOptions {
  maxLength?: number;
  required?: boolean;
  initialValue?: string;
}

export const useTextArea = ({
  maxLength = 200,
  required = false,
  initialValue = ''
}: UseTextAreaOptions = {}) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);

  // Create schema based on options
  const schema = required
    ? z
        .string()
        .min(1, 'This field is required')
        .max(maxLength, `Text must not exceed ${maxLength} characters`)
    : z.string().max(maxLength, `Text must not exceed ${maxLength} characters`).optional();

  const validate = useCallback(
    (text: string) => {
      try {
        schema.parse(text);
        setError(null);
        setIsValid(true);
        return true;
      } catch (err) {
        if (err instanceof z.ZodError) {
          const errorMessage = err.errors[0]?.message || 'Invalid input';
          setError(errorMessage);
          setIsValid(false);
          return false;
        }
        return false;
      }
    },
    [schema]
  );

  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      validate(newValue);
    },
    [validate]
  );

  const handleValidationChange = useCallback((valid: boolean, validationError?: string) => {
    setIsValid(valid);
    setError(validationError || null);
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
    setIsValid(true);
  }, [initialValue]);

  const wordCount = value.trim() === '' ? 0 : value.trim().split(/\s+/).length;
  const charCount = value.length;

  const clear = useCallback(() => {
    // Use handleChange to ensure validation and state updates happen correctly
    handleChange('');
  }, [handleChange]);

  return {
    value,
    setValue: handleChange,
    error,
    isValid,
    wordCount,
    charCount,
    maxLength,
    reset,
    clear,
    validate: () => validate(value),
    onValidationChange: handleValidationChange,
    // For use with TextArea component
    textAreaProps: {
      value,
      onChange: handleChange,
      onValidationChange: handleValidationChange,
      maxLength,
      onClear: clear
    }
  };
};
