import type { FC } from 'react';
import { useCallback, useState } from 'react';
import { z } from 'zod';
import Icon from '@/components/Icon';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// Zod schema for textarea validation
const textAreaSchema = z.string().max(200, 'Text must not exceed 200 characters').optional();

const IconHeader: FC<{ className?: string; title: string }> = ({ className, title }) => {
  return (
    <div className={cn(`flex items-center justify-start rounded-full`, className)}>
      <Icon
        size="md"
        type="documentLayout"
        className="bg-green-500 mr-[1rem] w-[2.75rem] h-auto p-[0.455rem]"
      />
      <h2 className="font-bold">{title}</h2>
    </div>
  );
};

interface TextAreaProps {
  title?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  onValidationChange?: (isValid: boolean, error?: string) => void;
  maxLength?: number;
}

export type { TextAreaProps };

export default function TextArea({
  title = 'Registo',
  placeholder = 'Motivo do registo',
  className,
  value: controlledValue,
  onChange,
  onValidationChange,
  maxLength = 200
}: TextAreaProps) {
  const [internalValue, setInternalValue] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const charCount = value.length;

  const validateText = useCallback(
    (text: string) => {
      try {
        textAreaSchema.parse(text);
        setValidationError(null);
        onValidationChange?.(true);
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMessage = error.errors[0]?.message || 'Invalid input';
          setValidationError(errorMessage);
          onValidationChange?.(false, errorMessage);
          return false;
        }
        return false;
      }
    },
    [onValidationChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;

      // Don't allow input if it exceeds the max length
      if (newValue.length > maxLength) {
        return;
      }

      // Update value
      if (controlledValue !== undefined) {
        onChange?.(newValue);
      } else {
        setInternalValue(newValue);
      }

      // Validate
      validateText(newValue);
    },
    [controlledValue, onChange, validateText, maxLength]
  );

  const isOverLimit = charCount > maxLength;

  return (
    <div className={cn('flex flex-col', className)}>
      <IconHeader className="mb-4" title={title} />
      <div className="relative">
        <Textarea
          className={cn(
            'textarea textarea-bordered w-full resize-none',
            validationError && 'border-red-500 focus-visible:ring-red-500',
            isOverLimit && 'border-red-500'
          )}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          rows={5}
        />

        <div className={cn('flex justify-end items-center text-2xs text-gray-500')}>
          <span>
            {charCount}/{maxLength}
          </span>
        </div>

        {validationError && <div className="text-red-500 text-sm mt-1">{validationError}</div>}
      </div>
    </div>
  );
}
