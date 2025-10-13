import { beforeEach, describe, expect, it, vi } from 'bun:test';
import { act, renderHook } from '@testing-library/react';
import { useDocumentDropzone } from './useDocumentDropzone';

function createFile(name: string, size: number, type: string): File {
  const file = new File(['a'.repeat(size)], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

describe('useDocumentDropzone', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useDocumentDropzone());
    expect(result.current.files).toEqual([]);
    expect(result.current.errors).toEqual([]);
    expect(result.current.dragActive).toBe(false);
  });

  it('handles drag events', () => {
    const { result } = renderHook(() => useDocumentDropzone());
    act(() => {
      result.current.onDragOver({ preventDefault: vi.fn() } as any);
    });
    expect(result.current.dragActive).toBe(true);
    act(() => {
      result.current.onDragLeave({ preventDefault: vi.fn() } as any);
    });
    expect(result.current.dragActive).toBe(false);
  });

  it('adds valid file on drop', async () => {
    const { result } = renderHook(() => useDocumentDropzone());
    const file = createFile('test.txt', 100, 'text/plain');
    const dataTransfer = { files: [file], length: 1 };
    await act(async () => {
      await result.current.onDrop({ preventDefault: vi.fn(), dataTransfer } as any);
    });
    expect(result.current.files.length).toBe(1);
    expect(result.current.files[0].name).toBe('test.txt');
  });

  it('rejects duplicate files', async () => {
    const { result } = renderHook(() => useDocumentDropzone());
    const file = createFile('dup.txt', 100, 'text/plain');
    await act(async () => {
      await result.current.processFiles([file]);
      await result.current.processFiles([file]);
    });
    expect(result.current.errors.some((e) => e.includes('já foi anexado'))).toBe(true);
  });

  it('removes file and clears error', async () => {
    const { result } = renderHook(() => useDocumentDropzone());
    const file = createFile('remove.txt', 100, 'text/plain');
    await act(async () => {
      await result.current.processFiles([file]);
    });
    expect(result.current.files.length).toBe(1);
    act(() => {
      result.current.removeFile(result.current.files[0]);
    });
    expect(result.current.files.length).toBe(0);
  });

  it('validates required files', async () => {
    const { result } = renderHook(() => useDocumentDropzone());
    let valid = false;
    act(() => {
      valid = result.current.validateFiles({ required: true });
    });
    expect(valid).toBe(false);
    expect(result.current.errors.some((e) => e.includes('pelo menos um ficheiro'))).toBe(true);
  });

  it('validates file size limits', async () => {
    const { result } = renderHook(() => useDocumentDropzone());
    const oversizedFile = createFile('huge.pdf', 5 * 1024 * 1024, 'application/pdf'); // 5MB - over limit

    await act(async () => {
      await result.current.processFiles([oversizedFile]);
    });

    expect(result.current.errors.some((e) => e.includes('não deve exceder'))).toBe(true);
  });

  it('validates file types', async () => {
    const { result } = renderHook(() => useDocumentDropzone());
    const invalidFile = createFile('bad.exe', 1024, 'application/octet-stream');

    await act(async () => {
      await result.current.processFiles([invalidFile]);
    });

    expect(result.current.errors.some((e) => e.includes('Unsupported file type'))).toBe(true);
  });

  it('validates total file size limit', async () => {
    const { result } = renderHook(() => useDocumentDropzone());
    const file1 = createFile('file1.pdf', 2.5 * 1024 * 1024, 'application/pdf'); // 2.5MB
    const file2 = createFile('file2.pdf', 2 * 1024 * 1024, 'application/pdf'); // 2MB - total 4.5MB over limit

    await act(async () => {
      await result.current.processFiles([file1]);
      await result.current.processFiles([file2]);
    });

    expect(result.current.errors.some((e) => e.includes('tamanho total'))).toBe(true);
  });

  it('handles file upload progress and completion', async () => {
    const { result } = renderHook(() => useDocumentDropzone());
    const file = createFile('progress.txt', 100, 'text/plain');

    await act(async () => {
      await result.current.processFiles([file]);
    });

    expect(result.current.files.length).toBe(1);
    expect(result.current.files[0].status).toBe('completed');
    expect(result.current.files[0].progress).toBe(100);
  });

  it('handles multiple file uploads', async () => {
    const { result } = renderHook(() => useDocumentDropzone());
    const files = [
      createFile('file1.txt', 100, 'text/plain'),
      createFile('file2.pdf', 200, 'application/pdf'),
      createFile('file3.jpg', 300, 'image/jpeg')
    ];

    await act(async () => {
      await result.current.processFiles(files);
    });

    expect(result.current.files.length).toBe(3);
    expect(result.current.files.map((f) => f.name)).toEqual([
      'file1.txt',
      'file2.pdf',
      'file3.jpg'
    ]);
  });

  it('handles paste events with clipboard files', async () => {
    const { result } = renderHook(() => useDocumentDropzone());
    const file = createFile('pasted.png', 1024, 'image/png');

    const mockClipboardEvent = {
      preventDefault: vi.fn(),
      clipboardData: {
        files: [file],
        items: []
      }
    };

    await act(async () => {
      await result.current.onPaste(mockClipboardEvent as any);
    });

    expect(result.current.files.length).toBe(1);
    expect(result.current.files[0].name).toBe('pasted.png');
  });

  it('handles paste events with clipboard items', async () => {
    const { result } = renderHook(() => useDocumentDropzone());
    const file = createFile('item.jpg', 1024, 'image/jpeg');

    const mockItem = {
      kind: 'file',
      getAsFile: () => file
    };

    const mockClipboardEvent = {
      preventDefault: vi.fn(),
      clipboardData: {
        files: [],
        items: [mockItem]
      }
    };

    await act(async () => {
      await result.current.onPaste(mockClipboardEvent as any);
    });

    expect(result.current.files.length).toBe(1);
    expect(result.current.files[0].name).toBe('item.jpg');
  });

  it('removes files and updates total size validation', async () => {
    const { result } = renderHook(() => useDocumentDropzone());
    const file1 = createFile('file1.pdf', 2 * 1024 * 1024, 'application/pdf'); // 2MB
    const file2 = createFile('file2.pdf', 2 * 1024 * 1024, 'application/pdf'); // 2MB

    await act(async () => {
      await result.current.processFiles([file1, file2]);
    });

    expect(result.current.files.length).toBe(2);

    act(() => {
      result.current.removeFile(result.current.files[0]);
    });

    expect(result.current.files.length).toBe(1);
    expect(result.current.files[0].name).toBe('file2.pdf');
  });

  it('handles file input change events', async () => {
    const { result } = renderHook(() => useDocumentDropzone());
    const file = createFile('input.txt', 100, 'text/plain');

    const mockInputEvent = {
      target: {
        files: [file],
        value: 'mock-file-path'
      }
    };

    await act(async () => {
      await result.current.onFileChange(mockInputEvent as any);
    });

    expect(result.current.files.length).toBe(1);
    expect(result.current.files[0].name).toBe('input.txt');
    // Verify that input value is cleared
    expect(mockInputEvent.target.value).toBe('');
  });

  it('validates files with uploading status', async () => {
    const { result } = renderHook(() => useDocumentDropzone());
    const file = createFile('uploading.txt', 100, 'text/plain');

    await act(async () => {
      await result.current.processFiles([file]);
    });

    // Manually set file to uploading status for test
    act(() => {
      result.current.files[0].status = 'uploading';
      result.current.files[0].progress = 50;
    });

    let valid = false;
    act(() => {
      valid = result.current.validateFiles();
    });

    expect(valid).toBe(false);
    expect(result.current.errors.some((e) => e.includes('Upload em progresso'))).toBe(true);
  });

  it('validates files with error status', async () => {
    const { result } = renderHook(() => useDocumentDropzone());
    const file = createFile('error.txt', 100, 'text/plain');

    await act(async () => {
      await result.current.processFiles([file]);
    });

    // Manually set file to error status for test
    act(() => {
      result.current.files[0].status = 'error';
      result.current.files[0].error = 'Upload failed';
    });

    let valid = false;
    act(() => {
      valid = result.current.validateFiles();
    });

    expect(valid).toBe(false);
    expect(result.current.errors.some((e) => e.includes('Upload failed'))).toBe(true);
  });

  it('revalidates total size when files change', async () => {
    const { result } = renderHook(() => useDocumentDropzone());
    const file1 = createFile('file1.pdf', 3 * 1024 * 1024, 'application/pdf'); // 3MB
    const file2 = createFile('file2.pdf', 2 * 1024 * 1024, 'application/pdf'); // 2MB - would exceed total

    await act(async () => {
      await result.current.processFiles([file1]);
    });

    expect(result.current.files.length).toBe(1);

    await act(async () => {
      await result.current.processFiles([file2]);
    });

    // Second file should be rejected due to total size limit
    expect(result.current.files.length).toBe(1);
    expect(result.current.errors.some((e) => e.includes('tamanho total'))).toBe(true);
  });

  it('handles click events to trigger file input', () => {
    const { result } = renderHook(() => useDocumentDropzone());
    const mockInput = { click: vi.fn() };
    result.current.inputRef.current = mockInput as any;

    act(() => {
      result.current.onClick();
    });

    expect(mockInput.click).toHaveBeenCalled();
  });

  it('provides correct accepted file extensions', () => {
    const { result } = renderHook(() => useDocumentDropzone());
    expect(result.current.acceptedFileExtensions).toBe('.png,.jpeg,.jpg,.pdf,.docx,.txt');
  });
});
