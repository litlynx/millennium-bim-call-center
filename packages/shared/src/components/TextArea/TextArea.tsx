import type { FC } from 'react';
import { useCallback, useState } from 'react';
import { z } from 'zod';
import DocumentDropzone from '@/components/DocumentDropzone';
import type { DocumentFile } from '@/components/DocumentDropzone/hooks/useDocumentDropzone';
import Icon from '@/components/Icon';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

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
  onClear?: () => void;
  maxLength?: number;
  enableDocuments?: boolean;
  dropzoneProps?: {
    inputRef: React.RefObject<HTMLInputElement>;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    onClick: () => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPaste?: (e: React.ClipboardEvent<HTMLDivElement>) => void;
    onRemoveFile: (file: DocumentFile) => void;
    acceptedFileExtensions: string;
  };
  files?: DocumentFile[];
  dragActive?: boolean;
  errors?: string[];
}

export type { TextAreaProps };

export default function TextArea({
  title = 'Registo',
  placeholder = 'Motivo do registo',
  className,
  value: controlledValue,
  onChange,
  onValidationChange,
  onClear,
  maxLength = 200,
  enableDocuments = false,
  dropzoneProps,
  files = [],
  dragActive = false,
  errors = []
}: TextAreaProps) {
  const [internalValue, setInternalValue] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const charCount = value.length;

  const validateText = useCallback(
    (text: string) => {
      try {
        // Zod schema: required, non-empty, max length
        const textAreaSchema = z
          .string()
          .min(1, 'Campo de texto tem que estar preenchido')
          .max(maxLength, `O texto não deve exceder os ${maxLength} caracteres`);
        textAreaSchema.parse(text);
        setValidationError(null);
        onValidationChange?.(true);
        return true;
      } catch (err) {
        if (err instanceof z.ZodError) {
          const errorMessage = err.issues[0]?.message || 'Invalid input';
          setValidationError(errorMessage);
          onValidationChange?.(false, errorMessage);
          return false;
        }
        return false;
      }
    },
    [onValidationChange, maxLength]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;

      // For clearing, always allow empty value
      if (newValue === '' || newValue.length <= maxLength) {
        // Update value
        if (controlledValue !== undefined) {
          onChange?.(newValue);
        } else {
          setInternalValue(newValue);
        }

        // Validate
        validateText(newValue);
      }
    },
    [controlledValue, onChange, validateText, maxLength]
  );

  const handleClear = useCallback(() => {
    // Clear validation state immediately
    setValidationError(null);
    onValidationChange?.(true);

    // Call the external clear handler if provided (from useTextArea hook)
    onClear?.();
  }, [onValidationChange, onClear]);

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
          onClear={handleClear}
          maxLength={maxLength}
          rows={5}
        />

        <div className={cn('flex justify-end items-center text-2xs text-gray-500')}>
          <span>
            {charCount}/{maxLength}
          </span>
        </div>

        {validationError && <div className="text-red-500 text-sm mt-1">{validationError}</div>}

        {enableDocuments && dropzoneProps && (
          <div className="mt-3" data-testid="document-dropzone-area">
            <DocumentDropzone
              files={files}
              dragActive={dragActive}
              errors={errors}
              {...dropzoneProps}
            />
          </div>
        )}
      </div>
    </div>
  );
}
