import { useDocumentDropzone } from '../../DocumentDropzone/hooks/useDocumentDropzone';
import { type UseTextAreaOptions, useTextArea } from './useTextArea';

export interface TextAreaWithDocumentsOptions extends UseTextAreaOptions {
  enableDocuments?: boolean;
}

export function useTextAreaWithDocuments(options: TextAreaWithDocumentsOptions = {}) {
  const { enableDocuments = false, ...textAreaOptions } = options;

  const textArea = useTextArea(textAreaOptions);
  const dropzone = useDocumentDropzone();

  return {
    // Text area properties and methods
    ...textArea,
    // Document dropzone properties and methods
    files: dropzone.files,
    dragActive: dropzone.dragActive,
    errors: dropzone.errors,
    dropzoneProps: {
      inputRef: dropzone.inputRef,
      onDrop: dropzone.onDrop,
      onDragOver: dropzone.onDragOver,
      onDragLeave: dropzone.onDragLeave,
      onClick: dropzone.onClick,
      onFileChange: dropzone.onFileChange,
      acceptedFileExtensions: dropzone.acceptedFileExtensions
    },
    validateAll: () => {
      let isAllValid = true;
      const validationErrors: string[] = [];

      const textValid = textArea.validate();
      if (!textValid) {
        isAllValid = false;
        if (textArea.error) {
          validationErrors.push(`Text: ${textArea.error}`);
        }
      }

      if (enableDocuments) {
        const filesValid = dropzone.validateFiles();
        if (!filesValid) {
          isAllValid = false;
          // Add file-specific errors
          if (dropzone.errors.length > 0) {
            validationErrors.push(...dropzone.errors.map((error) => `File: ${error}`));
          } else {
            validationErrors.push('File: Unknown validation error');
          }
        }
      }

      if (!isAllValid) {
        console.warn('Validation failed:', {
          textValid,
          filesValid: enableDocuments ? dropzone.validateFiles() : true,
          enableDocuments,
          errors: validationErrors,
          textError: textArea.error,
          fileErrors: dropzone.errors
        });
      }

      return isAllValid;
    },
    // Enable documents flag
    enableDocuments,
    // Additional validation helpers
    hasFileErrors: dropzone.errors.length > 0,
    isValid: textArea.isValid && (enableDocuments ? dropzone.validateFiles() : true),
    // Separate validation methods
    validateText: textArea.validate,
    validateFiles: () => {
      if (!enableDocuments) return true;
      return dropzone.validateFiles();
    },
    // Get all current validation errors
    getAllErrors: () => {
      const allErrors: string[] = [];

      // Add text errors
      if (textArea.error) {
        allErrors.push(`Text: ${textArea.error}`);
      }

      // Add file errors when documents are enabled
      if (enableDocuments && dropzone.errors.length > 0) {
        allErrors.push(...dropzone.errors.map((error) => `File: ${error}`));
      }

      return allErrors;
    },
    // Check if there are any validation errors
    hasErrors: () => {
      const textHasError = !!textArea.error;
      const filesHaveError = enableDocuments ? dropzone.errors.length > 0 : false;
      return textHasError || filesHaveError;
    }
  };
}

export type UseTextAreaWithDocumentsReturn = ReturnType<typeof useTextAreaWithDocuments>;
