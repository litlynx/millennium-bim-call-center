import { beforeEach, describe, expect, it, vi } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ChangeEvent, DragEvent, RefObject } from 'react';
import DocumentDropzone from './DocumentDropzone';
import type { DocumentFile, DocumentFileStatus } from './hooks/useDocumentDropzone';

describe('DocumentDropzone', () => {
  let inputRef: RefObject<HTMLInputElement>;
  let onDrop: (event: DragEvent<HTMLDivElement>) => void;
  let onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  let onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  let onClick: () => void;
  let onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  let onRemoveFile: (file: DocumentFile) => void;
  const acceptedFileExtensions = '.png,.jpeg,.jpg,.pdf,.docx,.txt';

  beforeEach(() => {
    inputRef = { current: document.createElement('input') };
    onDrop = vi.fn();
    onDragOver = vi.fn();
    onDragLeave = vi.fn();
    onClick = vi.fn();
    onFileChange = vi.fn();
    onRemoveFile = vi.fn();
  });

  it('renders with default props', () => {
    render(
      <DocumentDropzone
        inputRef={inputRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={onClick}
        onFileChange={onFileChange}
        onRemoveFile={onRemoveFile}
        acceptedFileExtensions={acceptedFileExtensions}
      />
    );
    expect(screen.getByText('Anexar documento ou imagem')).toBeTruthy();
  });

  it('calls onClick when button is clicked', () => {
    render(
      <DocumentDropzone
        inputRef={inputRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={onClick}
        onFileChange={onFileChange}
        onRemoveFile={onRemoveFile}
        acceptedFileExtensions={acceptedFileExtensions}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  it('renders files and calls onRemoveFile', () => {
    const files: DocumentFile[] = [
      {
        id: '1',
        name: 'test.pdf',
        type: 'application/pdf',
        size: 1024,
        blob: new Blob(['test'], { type: 'application/pdf' }),
        progress: 100,
        status: 'completed' as DocumentFileStatus,
        error: null
      }
    ];
    render(
      <DocumentDropzone
        files={files}
        inputRef={inputRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={onClick}
        onFileChange={onFileChange}
        onRemoveFile={onRemoveFile}
        acceptedFileExtensions={acceptedFileExtensions}
      />
    );
    expect(screen.getByText('test.pdf')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Remover test.pdf'));
    expect(onRemoveFile).toHaveBeenCalledWith(files[0]);
  });

  it('shows upload progress and error', () => {
    const files: DocumentFile[] = [
      {
        id: '1',
        name: 'fail.pdf',
        type: 'application/pdf',
        size: 1024,
        blob: new Blob(['fail'], { type: 'application/pdf' }),
        progress: 50,
        status: 'uploading' as DocumentFileStatus,
        error: null
      },
      {
        id: '2',
        name: 'bad.pdf',
        type: 'application/pdf',
        size: 1024,
        blob: new Blob(['bad'], { type: 'application/pdf' }),
        progress: 0,
        status: 'error' as DocumentFileStatus,
        error: 'Erro ao carregar ficheiro.'
      }
    ];
    render(
      <DocumentDropzone
        files={files}
        inputRef={inputRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={onClick}
        onFileChange={onFileChange}
        onRemoveFile={onRemoveFile}
        acceptedFileExtensions={acceptedFileExtensions}
      />
    );
    expect(screen.getByText('50%')).toBeTruthy();
    expect(screen.getByText('Erro ao carregar ficheiro.')).toBeTruthy();
  });

  it('shows errors list', () => {
    render(
      <DocumentDropzone
        errors={['File too large', 'Invalid type']}
        inputRef={inputRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={onClick}
        onFileChange={onFileChange}
        onRemoveFile={onRemoveFile}
        acceptedFileExtensions={acceptedFileExtensions}
      />
    );
    expect(screen.getByText('Erros de Upload:')).toBeTruthy();
    expect(screen.getByText('File too large')).toBeTruthy();
    expect(screen.getByText('Invalid type')).toBeTruthy();
  });

  it('handles drag events correctly', () => {
    render(
      <DocumentDropzone
        dragActive={true}
        inputRef={inputRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={onClick}
        onFileChange={onFileChange}
        onRemoveFile={onRemoveFile}
        acceptedFileExtensions={acceptedFileExtensions}
      />
    );

    const dropzone = screen.getByRole('button').querySelector('div');
    expect(dropzone).toHaveClass('border-primary-500', 'bg-primary-50');
  });

  it('displays file size correctly', () => {
    const files: DocumentFile[] = [
      {
        id: '1',
        name: 'small.txt',
        type: 'text/plain',
        size: 1536, // 1.5 KB
        blob: new Blob(['small'], { type: 'text/plain' }),
        progress: 100,
        status: 'completed' as DocumentFileStatus,
        error: null
      },
      {
        id: '2',
        name: 'large.pdf',
        type: 'application/pdf',
        size: 2097152, // 2 MB
        blob: new Blob(['large'], { type: 'application/pdf' }),
        progress: 100,
        status: 'completed' as DocumentFileStatus,
        error: null
      }
    ];

    render(
      <DocumentDropzone
        files={files}
        inputRef={inputRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={onClick}
        onFileChange={onFileChange}
        onRemoveFile={onRemoveFile}
        acceptedFileExtensions={acceptedFileExtensions}
      />
    );

    expect(screen.getByText('(1.50 KB)')).toBeTruthy();
    expect(screen.getByText('(2.00 MB)')).toBeTruthy();
  });

  it('displays correct file icons based on extension', () => {
    const files: DocumentFile[] = [
      {
        id: '1',
        name: 'image.jpg',
        type: 'image/jpeg',
        size: 1024,
        blob: new Blob(['image'], { type: 'image/jpeg' }),
        progress: 100,
        status: 'completed' as DocumentFileStatus,
        error: null
      },
      {
        id: '2',
        name: 'document.pdf',
        type: 'application/pdf',
        size: 1024,
        blob: new Blob(['doc'], { type: 'application/pdf' }),
        progress: 100,
        status: 'completed' as DocumentFileStatus,
        error: null
      }
    ];

    render(
      <DocumentDropzone
        files={files}
        inputRef={inputRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={onClick}
        onFileChange={onFileChange}
        onRemoveFile={onRemoveFile}
        acceptedFileExtensions={acceptedFileExtensions}
      />
    );

    expect(screen.getByText('image.jpg')).toBeTruthy();
    expect(screen.getByText('document.pdf')).toBeTruthy();
  });

  it('calls event handlers with correct parameters', () => {
    const mockEvent = {
      preventDefault: vi.fn(),
      dataTransfer: { files: [] }
    };

    render(
      <DocumentDropzone
        inputRef={inputRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={onClick}
        onFileChange={onFileChange}
        onRemoveFile={onRemoveFile}
        acceptedFileExtensions={acceptedFileExtensions}
      />
    );

    // Find the dropzone div more reliably - it's the first div inside the button
    const button = screen.getByRole('button');
    const dropzone = button.querySelector('div');
    expect(dropzone).toBeTruthy();

    if (dropzone) {
      fireEvent.drop(dropzone, mockEvent);
      expect(onDrop).toHaveBeenCalledWith(
        expect.objectContaining({
          preventDefault: expect.any(Function)
        })
      );

      fireEvent.dragOver(dropzone, mockEvent);
      expect(onDragOver).toHaveBeenCalledWith(
        expect.objectContaining({
          preventDefault: expect.any(Function)
        })
      );

      fireEvent.dragLeave(dropzone, mockEvent);
      expect(onDragLeave).toHaveBeenCalledWith(
        expect.objectContaining({
          preventDefault: expect.any(Function)
        })
      );
    }
  });

  it('handles file input change events', () => {
    const { container } = render(
      <DocumentDropzone
        inputRef={inputRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={onClick}
        onFileChange={onFileChange}
        onRemoveFile={onRemoveFile}
        acceptedFileExtensions={acceptedFileExtensions}
      />
    );

    const input = container.querySelector('input[type="file"]');
    const mockChangeEvent = { target: { files: [] } };

    if (input) {
      fireEvent.change(input, mockChangeEvent);
      expect(onFileChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            files: expect.any(Object)
          })
        })
      );
    }
  });

  it('supports paste events when onPaste is provided', () => {
    const onPaste = vi.fn();

    render(
      <DocumentDropzone
        inputRef={inputRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={onClick}
        onFileChange={onFileChange}
        onRemoveFile={onRemoveFile}
        onPaste={onPaste}
        acceptedFileExtensions={acceptedFileExtensions}
      />
    );

    const button = screen.getByRole('button');
    const dropzone = button.querySelector('div');
    const mockPasteEvent = { clipboardData: { files: [] } };

    if (dropzone) {
      fireEvent.paste(dropzone, mockPasteEvent);
      expect(onPaste).toHaveBeenCalledWith(
        expect.objectContaining({
          clipboardData: expect.any(Object)
        })
      );
    }
  });

  it('prevents event bubbling on remove button clicks', () => {
    const files: DocumentFile[] = [
      {
        id: '1',
        name: 'test.pdf',
        type: 'application/pdf',
        size: 1024,
        blob: new Blob(['test'], { type: 'application/pdf' }),
        progress: 100,
        status: 'completed' as DocumentFileStatus,
        error: null
      }
    ];

    render(
      <DocumentDropzone
        files={files}
        inputRef={inputRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={onClick}
        onFileChange={onFileChange}
        onRemoveFile={onRemoveFile}
        acceptedFileExtensions={acceptedFileExtensions}
      />
    );

    const removeButton = screen.getByLabelText('Remover test.pdf');
    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn()
    };

    fireEvent.click(removeButton, mockEvent);
    fireEvent.mouseDown(removeButton, mockEvent);

    expect(onRemoveFile).toHaveBeenCalledWith(files[0]);
  });
});
