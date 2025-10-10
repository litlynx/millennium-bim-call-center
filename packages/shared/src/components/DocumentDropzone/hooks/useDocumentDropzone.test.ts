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
});
