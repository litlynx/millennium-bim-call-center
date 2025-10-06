import { useCallback, useRef, useState } from 'react';
import { z } from 'zod';

export const ACCEPTED_FILE_EXTENSIONS = '.png,.jpeg,.jpg,.pdf,.docx,.txt';
const FILE_UPLOAD_MAX_SIZE = 4 * 1024 * 1024; // 4MB

const fileSchema = z.object({
  name: z.string(),
  type: z.enum(
    [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ],
    {
      errorMap: () => ({ message: 'Unsupported file type' })
    }
  ),
  size: z
    .number()
    .max(
      FILE_UPLOAD_MAX_SIZE,
      `File size should not exceed ${FILE_UPLOAD_MAX_SIZE / (1024 * 1024)} MB`
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
    setFiles((prev) => [...prev, ...processed]);
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
    acceptedFileExtensions: ACCEPTED_FILE_EXTENSIONS
  };
}
