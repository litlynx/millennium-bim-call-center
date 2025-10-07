import type { ClipboardEvent } from 'react';
import { useCallback, useRef, useState } from 'react';
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
const FILE_UPLOAD_MAX_SIZE = 4 * 1024 * 1024; // 4MB

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

export type DocumentFile = {
  name: string;
  type: string;
  size: number;
  blob: Blob;
  base64: Base64URLString;
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useDocumentDropzone() {
  const removeFile = useCallback((fileToRemove: DocumentFile) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileToRemove.name));
  }, []);
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(async (fileList: FileList | File[]) => {
    const newErrors: string[] = [];
    const validFiles: File[] = [];
    for (const file of Array.from(fileList)) {
      const result = fileSchema.safeParse({ name: file.name, type: file.type, size: file.size });
      if (result.success) {
        validFiles.push(file);
      } else {
        newErrors.push(`${file.name}: ${result.error.errors.map((e) => e.message).join(', ')}`);
      }
    }
    setErrors(newErrors);
    const processed = await Promise.all(
      validFiles.map(async (file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        blob: file,
        base64: await fileToBase64(file)
      }))
    );
    setFiles((prev) => {
      // Filter out duplicates based on name and size
      const existingFileKeys = new Set(prev.map((f) => `${f.name}-${f.size}`));
      const uniqueNewFiles = processed.filter(
        (file) => !existingFileKeys.has(`${file.name}-${file.size}`)
      );
      return [...prev, ...uniqueNewFiles];
    });
  }, []);

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

      for (const error of errors) {
        if (!validationErrors.includes(error)) {
          validationErrors.push(error);
        }
      }

      setErrors(validationErrors);
      return validationErrors.length === 0;
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
    processFiles
  };
}
