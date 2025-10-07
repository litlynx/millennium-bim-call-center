import { useDocumentDropzone } from '../../DocumentDropzone/hooks/useDocumentDropzone';
import { type UseTextAreaOptions, useTextArea } from './useTextArea';

export interface TextAreaWithDocumentsOptions extends UseTextAreaOptions {
  enableDocuments?: boolean;
  documentsRequired?: boolean;
}

export function useTextAreaWithDocuments(options: TextAreaWithDocumentsOptions = {}) {
  const { enableDocuments = false, documentsRequired = false, ...textAreaOptions } = options;

  const textArea = useTextArea(textAreaOptions);
  const dropzone = useDocumentDropzone();
  const uploadsInProgress = dropzone.files.some((file) => file.status === 'uploading');
  const fileFailures = dropzone.files.filter((file) => file.status === 'error');
  const hasDropzoneErrors = dropzone.errors.length > 0 || fileFailures.length > 0;
  const documentsMissing = documentsRequired && dropzone.files.length === 0;
  const filesAreValid = !hasDropzoneErrors && !documentsMissing && !uploadsInProgress;

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
      onPaste: dropzone.onPaste,
      onRemoveFile: dropzone.removeFile,
      acceptedFileExtensions: dropzone.acceptedFileExtensions
    },
    revalidateTotalSize: () => dropzone.revalidateTotalSize(dropzone.files),
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
        const filesValid = dropzone.validateFiles({ required: documentsRequired });
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
          filesValid: enableDocuments ? filesAreValid : true,
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
    documentsRequired,
    // Additional validation helpers
    hasFileErrors: hasDropzoneErrors || documentsMissing || uploadsInProgress,
    isValid: textArea.isValid && (enableDocuments ? filesAreValid : true),
    // Separate validation methods
    validateText: textArea.validate,
    validateFiles: () => {
      if (!enableDocuments) return true;
      return dropzone.validateFiles({ required: documentsRequired });
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

      if (enableDocuments && fileFailures.length > 0) {
        for (const failedFile of fileFailures) {
          const message = failedFile.error ?? 'Erro ao carregar ficheiro.';
          allErrors.push(`File: ${failedFile.name} - ${message}`);
        }
      }

      if (enableDocuments && documentsMissing) {
        const requiredMessage = 'File: É necessário anexar pelo menos um ficheiro.';
        if (!allErrors.includes(requiredMessage)) {
          allErrors.push(requiredMessage);
        }
      }

      if (enableDocuments && uploadsInProgress) {
        allErrors.push('File: Existem ficheiros ainda a serem carregados.');
      }

      return allErrors;
    },
    // Check if there are any validation errors
    hasErrors: () => {
      const textHasError = !!textArea.error;
      const filesHaveError = enableDocuments
        ? dropzone.errors.length > 0 ||
          documentsMissing ||
          uploadsInProgress ||
          fileFailures.length > 0
        : false;
      return textHasError || filesHaveError;
    }
  };
}

export type UseTextAreaWithDocumentsReturn = ReturnType<typeof useTextAreaWithDocuments>;
