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
});
