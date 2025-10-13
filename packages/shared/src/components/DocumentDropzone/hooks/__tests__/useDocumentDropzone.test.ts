import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import { act, renderHook } from '@testing-library/react';
import { useDocumentDropzone } from '../useDocumentDropzone';

// Mock file creation helper
const createMockFile = (name: string, size: number, type: string = 'application/pdf'): File => {
  const file = new File([''], name, { type });
  Object.defineProperty(file, 'size', { value: size, writable: false });
  return file;
};

describe('useDocumentDropzone - New File Limits', () => {
  beforeEach(() => {
    global.URL.createObjectURL = mock(() => 'mock-url');
    global.URL.revokeObjectURL = mock(() => {});
  });

  afterEach(() => {
    // Reset mocks if needed
  });

  describe('File size limits', () => {
    it('should accept files under 5MB', async () => {
      const { result } = renderHook(() => useDocumentDropzone());

      const file = createMockFile('test.pdf', 4 * 1024 * 1024); // 4MB
      const fileList = [file] as unknown as FileList;

      await act(async () => {
        await result.current.processFiles(fileList);
      });

      expect(result.current.files).toHaveLength(1);
      expect(result.current.errors).toHaveLength(0);
    });

    it('should reject files over 5MB', async () => {
      const { result } = renderHook(() => useDocumentDropzone());

      const file = createMockFile('large-file.pdf', 6 * 1024 * 1024); // 6MB
      const fileList = [file] as unknown as FileList;

      await act(async () => {
        await result.current.processFiles(fileList);
      });

      expect(result.current.files).toHaveLength(0);
      expect(result.current.errors).toContain(
        'large-file.pdf: O tamanho do ficheiro não deve exceder 5 MB'
      );
    });

    it('should accept exactly 5MB files', async () => {
      const { result } = renderHook(() => useDocumentDropzone());

      const file = createMockFile('exact-limit.pdf', 5 * 1024 * 1024); // 5MB
      const fileList = [file] as unknown as FileList;

      await act(async () => {
        await result.current.processFiles(fileList);
      });

      expect(result.current.files).toHaveLength(1);
      expect(result.current.errors).toHaveLength(0);
    });
  });

  describe('File count limits', () => {
    it('should accept up to 5 files', async () => {
      const { result } = renderHook(() => useDocumentDropzone());

      const files = Array.from(
        { length: 5 },
        (_, i) => createMockFile(`file-${i + 1}.pdf`, 1024 * 1024) // 1MB each
      );
      const fileList = files as unknown as FileList;

      await act(async () => {
        await result.current.processFiles(fileList);
      });

      expect(result.current.files).toHaveLength(5);
      expect(result.current.errors).toHaveLength(0);
    });

    it('should reject more than 5 files', async () => {
      const { result } = renderHook(() => useDocumentDropzone());

      const files = Array.from(
        { length: 6 },
        (_, i) => createMockFile(`file-${i + 1}.pdf`, 1024 * 1024) // 1MB each
      );
      const fileList = files as unknown as FileList;

      await act(async () => {
        await result.current.processFiles(fileList);
      });

      expect(result.current.files).toHaveLength(5); // Should stop at 5
      expect(result.current.errors).toContain('Não é possível anexar mais de 5 ficheiros.');
    });

    it('should prevent adding new files when already at limit', async () => {
      const { result } = renderHook(() => useDocumentDropzone());

      // First add 5 files
      const firstBatch = Array.from({ length: 5 }, (_, i) =>
        createMockFile(`file-${i + 1}.pdf`, 1024 * 1024)
      );

      await act(async () => {
        await result.current.processFiles(firstBatch as unknown as FileList);
      });

      expect(result.current.files).toHaveLength(5);

      // Try to add one more
      const additionalFile = createMockFile('extra-file.pdf', 1024 * 1024);

      await act(async () => {
        await result.current.processFiles([additionalFile] as unknown as FileList);
      });

      expect(result.current.files).toHaveLength(5); // Should remain 5
      expect(result.current.errors).toContain('Não é possível anexar mais de 5 ficheiros.');
    });

    it('should allow adding files after removing some', async () => {
      const { result } = renderHook(() => useDocumentDropzone());

      // Add 5 files
      const files = Array.from({ length: 5 }, (_, i) =>
        createMockFile(`file-${i + 1}.pdf`, 1024 * 1024)
      );

      await act(async () => {
        await result.current.processFiles(files as unknown as FileList);
      });

      expect(result.current.files).toHaveLength(5);

      // Remove one file
      const firstFile = result.current.files[0];

      act(() => {
        result.current.removeFile(firstFile);
      });

      expect(result.current.files).toHaveLength(4);

      // Now add a new file
      const newFile = createMockFile('new-file.pdf', 1024 * 1024);

      await act(async () => {
        await result.current.processFiles([newFile] as unknown as FileList);
      });

      expect(result.current.files).toHaveLength(5);
      expect(result.current.errors).toHaveLength(0);
    });
  });

  describe('Mixed validation scenarios', () => {
    it('should handle files that exceed both size and count limits', async () => {
      const { result } = renderHook(() => useDocumentDropzone());

      // Try to add 7 files, with some over 5MB
      const files = [
        createMockFile('file-1.pdf', 6 * 1024 * 1024), // 6MB - too big
        createMockFile('file-2.pdf', 1024 * 1024), // 1MB - OK
        createMockFile('file-3.pdf', 1024 * 1024), // 1MB - OK
        createMockFile('file-4.pdf', 1024 * 1024), // 1MB - OK
        createMockFile('file-5.pdf', 1024 * 1024), // 1MB - OK
        createMockFile('file-6.pdf', 1024 * 1024), // 1MB - OK (reaches limit)
        createMockFile('file-7.pdf', 1024 * 1024) // 1MB - would exceed count
      ];

      await act(async () => {
        await result.current.processFiles(files as unknown as FileList);
      });

      // Files 2-6 should be added (file 1 rejected for size, file 7 rejected for count)
      expect(result.current.files).toHaveLength(5); // files 2, 3, 4, 5, 6 = 5 files
      expect(result.current.errors).toContain(
        'file-1.pdf: O tamanho do ficheiro não deve exceder 5 MB'
      );
      expect(result.current.errors).toContain('Não é possível anexar mais de 5 ficheiros.');
    });

    it('should validate file count when validating existing files', () => {
      const { result } = renderHook(() => useDocumentDropzone());

      // This test validates the validateFiles function with required parameter
      act(() => {
        result.current.validateFiles({ required: false });
      });

      // The validation should work without errors for empty files
      expect(result.current.errors).toHaveLength(0);
    });
  });

  describe('API compatibility', () => {
    it('should maintain revalidateFileCount function in return value', () => {
      const { result } = renderHook(() => useDocumentDropzone());

      expect(typeof result.current.revalidateFileCount).toBe('function');
    });
  });

  describe('Backward compatibility', () => {
    it('should maintain all existing functionality', () => {
      const { result } = renderHook(() => useDocumentDropzone());

      // Verify all expected properties exist
      expect(result.current).toHaveProperty('files');
      expect(result.current).toHaveProperty('errors');
      expect(result.current).toHaveProperty('dragActive');
      expect(result.current).toHaveProperty('processFiles');
      expect(result.current).toHaveProperty('removeFile');
      expect(result.current).toHaveProperty('validateFiles');
      expect(result.current).toHaveProperty('revalidateFileCount');
      expect(result.current).toHaveProperty('onDrop');
      expect(result.current).toHaveProperty('onDragOver');
      expect(result.current).toHaveProperty('onDragLeave');
      expect(result.current).toHaveProperty('onClick');
      expect(result.current).toHaveProperty('onFileChange');
      expect(result.current).toHaveProperty('onPaste');
      expect(result.current).toHaveProperty('acceptedFileExtensions');
    });

    it('should still reject unsupported file types', async () => {
      const { result } = renderHook(() => useDocumentDropzone());

      const unsupportedFile = createMockFile('test.exe', 1024, 'application/exe');

      await act(async () => {
        await result.current.processFiles([unsupportedFile] as unknown as FileList);
      });

      expect(result.current.files).toHaveLength(0);
      expect(result.current.errors.some((error) => error.includes('Unsupported file type'))).toBe(
        true
      );
    });

    it('should still handle duplicate files', async () => {
      const { result } = renderHook(() => useDocumentDropzone());

      const file1 = createMockFile('test.pdf', 1024);
      const file2 = createMockFile('test.pdf', 1024); // Same name and size

      await act(async () => {
        await result.current.processFiles([file1] as unknown as FileList);
      });

      expect(result.current.files).toHaveLength(1);

      await act(async () => {
        await result.current.processFiles([file2] as unknown as FileList);
      });

      expect(result.current.files).toHaveLength(1); // Should not add duplicate
      expect(
        result.current.errors.some((error) => error.includes('Este ficheiro já foi anexado'))
      ).toBe(true);
    });
  });
});
