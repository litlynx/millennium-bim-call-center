import type { ClipboardEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod';

export const ACCEPTED_FILE_EXTENSIONS = '.png,.jpeg,.jpg,.pdf,.docx,.txt';
export const ACCEPTED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
] as const;
export const FILE_UPLOAD_MAX_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILES_COUNT = 5;
const MAX_FILES_ERROR_MESSAGE = `Não é possível anexar mais de ${MAX_FILES_COUNT} ficheiros.`;

const fileSchema = z.object({
  name: z.string(),
  type: z.enum(ACCEPTED_MIME_TYPES, {
    errorMap: () => ({ message: 'Unsupported file type' })
  }),
  size: z
    .number()
    .max(
      FILE_UPLOAD_MAX_SIZE,
      `O tamanho do ficheiro não deve exceder ${FILE_UPLOAD_MAX_SIZE / (1024 * 1024)} MB`
    )
});

export type DocumentFileStatus = 'uploading' | 'completed' | 'error';

export type DocumentFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified?: number;
  blob: Blob;
  base64?: Base64URLString;
  progress: number;
  status: DocumentFileStatus;
  error?: string | null;
};

const createFileId = (file: { name: string; size: number; lastModified?: number }) =>
  `${file.name}-${file.size}-${file.lastModified ?? 'nlm'}`;

function fileToBase64(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Base64URLString> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress?.(progress);
      } else {
        onProgress?.(50);
      }
    };

    reader.onload = () => {
      onProgress?.(100);
      resolve(reader.result as Base64URLString);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

export function useDocumentDropzone() {
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<DocumentFile[]>([]);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  const revalidateFileCount = useCallback((currentFiles: DocumentFile[]) => {
    setErrors((prevErrors) => {
      if (currentFiles.length > MAX_FILES_COUNT) {
        if (prevErrors.includes(MAX_FILES_ERROR_MESSAGE)) {
          return prevErrors;
        }
        return [...prevErrors, MAX_FILES_ERROR_MESSAGE];
      }

      return prevErrors.filter((error) => error !== MAX_FILES_ERROR_MESSAGE);
    });
  }, []);

  const removeFile = useCallback((fileToRemove: DocumentFile) => {
    setFiles((prev) => {
      const nextFiles = prev.filter((file) => file.id !== fileToRemove.id);

      setErrors((prevErrors) => {
        const filteredErrors = prevErrors.filter((error) => !error.startsWith(fileToRemove.name));

        if (nextFiles.length > MAX_FILES_COUNT) {
          if (filteredErrors.includes(MAX_FILES_ERROR_MESSAGE)) {
            return filteredErrors;
          }
          return [...filteredErrors, MAX_FILES_ERROR_MESSAGE];
        }

        return filteredErrors.filter((error) => error !== MAX_FILES_ERROR_MESSAGE);
      });

      return nextFiles;
    });
  }, []);

  const updateFile = useCallback((id: string, updates: Partial<DocumentFile>) => {
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, ...updates } : file)));
  }, []);

  const processSingleFile = useCallback(
    async (file: File, id: string) => {
      try {
        const base64 = await fileToBase64(file, (progress) => {
          updateFile(id, {
            progress,
            status: progress >= 100 ? 'completed' : 'uploading'
          });
        });

        updateFile(id, {
          base64,
          progress: 100,
          status: 'completed',
          error: null
        });
      } catch (error) {
        console.error('Error processing file', error);
        updateFile(id, {
          progress: 0,
          status: 'error',
          error: 'Erro ao carregar ficheiro.'
        });
        setErrors((prev) => [...prev, `${file.name}: Erro ao carregar ficheiro.`]);
      }
    },
    [updateFile]
  );

  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const candidateFiles = Array.from(fileList);
      const validationErrors: string[] = [];
      const filesToProcess: Array<{ file: File; id: string }> = [];
      const newFiles: DocumentFile[] = [];
      const existingIds = new Set(filesRef.current.map((file) => file.id));

      for (const file of candidateFiles) {
        const result = fileSchema.safeParse({
          name: file.name,
          type: file.type,
          size: file.size
        });

        if (!result.success) {
          const issues = result.error?.issues ?? [];
          const messages = issues.map((e) => e.message).join(', ') || 'Erro ao validar ficheiro.';
          validationErrors.push(`${file.name}: ${messages}`);
          continue;
        }

        const id = createFileId(file);

        if (existingIds.has(id)) {
          validationErrors.push(`${file.name}: Este ficheiro já foi anexado.`);
          continue;
        }

        // Check if adding this file would exceed the maximum file count
        if (filesRef.current.length + filesToProcess.length >= MAX_FILES_COUNT) {
          validationErrors.push(MAX_FILES_ERROR_MESSAGE);
          break; // Stop processing more files
        }

        existingIds.add(id);
        filesToProcess.push({ file, id });
        newFiles.push({
          id,
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          blob: file,
          base64: undefined,
          progress: 0,
          status: 'uploading',
          error: null
        });
      }

      if (validationErrors.length > 0) {
        setErrors((prev) => {
          const combined = [...prev, ...validationErrors];
          return Array.from(new Set(combined));
        });
      }

      if (newFiles.length > 0) {
        setFiles((prev) => {
          if (prev.length === 0) {
            const nextState = [...newFiles];
            filesRef.current = nextState;
            return nextState;
          }

          const currentIds = new Set(prev.map((file) => file.id));
          const additions = newFiles.filter((file) => {
            if (currentIds.has(file.id)) {
              return false;
            }
            currentIds.add(file.id);
            return true;
          });

          if (additions.length === 0) {
            return prev;
          }

          const nextState = [...prev, ...additions];
          filesRef.current = nextState;
          return nextState;
        });
      }

      if (filesToProcess.length === 0) {
        return;
      }

      await Promise.all(filesToProcess.map(({ file, id }) => processSingleFile(file, id)));
    },
    [processSingleFile]
  );

  const onDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        await processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const onClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        await processFiles(e.target.files);
        e.target.value = '';
      }
    },
    [processFiles]
  );

  const onPaste = useCallback(
    async (event: ClipboardEvent<HTMLDivElement>) => {
      event.preventDefault();

      const clipboardData = event.clipboardData;
      if (!clipboardData) return;

      const collectedFiles: File[] = [];

      if (clipboardData.files?.length) {
        collectedFiles.push(...Array.from(clipboardData.files));
      }

      if (clipboardData.items?.length) {
        for (const item of Array.from(clipboardData.items)) {
          if (item.kind !== 'file') continue;

          const file = item.getAsFile();
          if (!file) continue;

          const alreadyCollected = collectedFiles.some(
            (existing) => existing.name === file.name && existing.size === file.size
          );

          if (!alreadyCollected) {
            collectedFiles.push(file);
          }
        }
      }

      if (collectedFiles.length > 0) {
        await processFiles(collectedFiles);
      }
    },
    [processFiles]
  );

  const validateFiles = useCallback(
    ({ required = false }: { required?: boolean } = {}) => {
      const validationErrors: string[] = [];

      if (required && files.length === 0) {
        validationErrors.push('É necessário anexar pelo menos um ficheiro.');
      }

      for (const file of files) {
        if (file.status === 'error') {
          validationErrors.push(`${file.name}: ${file.error ?? 'Erro ao carregar ficheiro.'}`);
          continue;
        }

        if (file.status !== 'completed') {
          validationErrors.push(`${file.name}: Upload em progresso.`);
        }

        const result = fileSchema.safeParse({
          name: file.name,
          type: file.type,
          size: file.size
        });

        if (!result.success) {
          validationErrors.push(
            `${file.name}: ${result.error.errors.map((error) => error.message).join(', ')}`
          );
        }
      }

      // Check if the total number of files exceeds the maximum
      if (files.length > MAX_FILES_COUNT && !validationErrors.includes(MAX_FILES_ERROR_MESSAGE)) {
        validationErrors.push(MAX_FILES_ERROR_MESSAGE);
      }

      // Only preserve errors from the error state if they're still relevant
      // Filter out old rejection errors for files that are no longer in the current file list
      const currentFileNames = new Set(files.map((f) => f.name));
      if (errors.length > 0) {
        for (const error of errors) {
          // Skip if error is already in validationErrors
          if (validationErrors.includes(error)) {
            continue;
          }

          // Check if error is a file-specific error (starts with filename)
          const isFileError = error.includes(':');
          if (isFileError) {
            // Extract filename from error message (format: "filename: error message")
            const fileName = error.split(':')[0].trim();
            // Only include error if the file is still in the current list
            if (currentFileNames.has(fileName)) {
              validationErrors.push(error);
            }
            // Skip errors for rejected/removed files
          } else {
            // Non-file-specific errors (like total size) are handled above
            // Don't carry them forward from the error state
          }
        }
      }

      const uniqueValidationErrors = Array.from(new Set(validationErrors));
      setErrors(uniqueValidationErrors);
      return uniqueValidationErrors.length === 0;
    },
    [errors, files]
  );

  return {
    files,
    dragActive,
    errors,
    inputRef,
    onDrop,
    onDragOver,
    onDragLeave,
    onClick,
    onFileChange,
    acceptedFileExtensions: ACCEPTED_FILE_EXTENSIONS,
    validateFiles,
    removeFile,
    onPaste,
    processFiles,
    revalidateFileCount
  };
}
