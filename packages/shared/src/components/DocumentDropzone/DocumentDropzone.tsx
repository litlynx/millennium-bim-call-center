import type { ChangeEvent, ClipboardEvent, DragEvent, MouseEvent, RefObject } from 'react';

import Icon, { type IconType } from '@/components/Icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { cn } from '@/lib/utils';
import type { DocumentFile } from './hooks/useDocumentDropzone';

interface DocumentDropzoneProps {
  className?: string;
  files?: DocumentFile[];
  dragActive?: boolean;
  errors?: string[];
  inputRef: RefObject<HTMLInputElement>;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (file: DocumentFile) => void;
  acceptedFileExtensions: string;
  onPaste?: (event: ClipboardEvent<HTMLDivElement>) => void;
}

export default function DocumentDropzone({
  className,
  files = [],
  dragActive = false,
  errors = [],
  inputRef,
  onDrop,
  onDragOver,
  onDragLeave,
  onClick,
  onFileChange,
  acceptedFileExtensions,
  onRemoveFile,
  onPaste
}: DocumentDropzoneProps) {
  function getFileIconType(fileName: string): IconType {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) return 'docFile';

    const imageExtensions = ['jpg', 'jpeg', 'png'];
    const docExtensions = ['doc', 'docx', 'pdf', 'txt'];

    if (imageExtensions.includes(extension)) return 'imgFile';
    if (docExtensions.includes(extension)) return 'docFile';

    return 'docFile';
  }

  function formatFileSize(bytes: number): string {
    const KB = 1024;
    const MB = KB * 1024;

    if (bytes < MB) {
      const sizeKB = bytes / KB;
      return `${sizeKB.toFixed(2)} KB`;
    }

    const sizeMB = bytes / MB;
    return `${sizeMB.toFixed(2)} MB`;
  }

  const handleRemoveClick = (event: MouseEvent<HTMLButtonElement>, file: DocumentFile) => {
    event.preventDefault();
    event.stopPropagation();
    onRemoveFile(file);
  };

  return (
    <>
      <div
        className={cn(
          `flex flex-col gap-6 rounded-lg border-2 border-dashed p-8 2xl:flex-row 2xl:gap-8`,
          dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-400 bg-white',
          className
        )}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onPaste={onPaste}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedFileExtensions}
          className="hidden"
          onChange={onFileChange}
        />

        <button
          type="button"
          onClick={onClick}
          className="flex w-full items-center gap-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <Icon type="upload" className="p-0" />

          <div className="flex flex-col gap-2 text-left">
            <p className="font-bold">Anexar documento ou imagem</p>
            <span className="text-sm">Arraste ou cole o ficheiro a carregar</span>
            <span className="text-xs text-gray-400">
              Apenas ficheiros JPEG, PNG, DOCX, PDF e TXT até 4MB no total
            </span>
          </div>
        </button>

        <div className="flex flex-col gap-4">
          {files.map((file) => {
            const sizeLabel = formatFileSize(file.size);
            const isUploading = file.status === 'uploading';
            const isError = file.status === 'error';
            const progressValue = Math.min(100, Math.max(0, file.progress));

            return (
              <div key={file.id} className="flex gap-6">
                <div className="flex w-full flex-col gap-3 lg:min-w-80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 pr-2">
                      <Icon className="w-4 h-4 p-0" type={getFileIconType(file.name)} />
                      <div className="flex w-full flex-row items-center justify-between gap-2">
                        <p className="text-sm font-medium text-gray-700">{file.name}</p>
                        <span className="text-nowrap text-gray-400 font-light text-xs">
                          ({sizeLabel})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isUploading && (
                        <span className="text-xs text-gray-500">{file.progress}%</span>
                      )}
                      {isError && (
                        <span className="text-xs text-red-500">
                          {file.error ?? 'Erro ao carregar ficheiro.'}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(event) => handleRemoveClick(event, file)}
                        onMouseDown={(event) => event.stopPropagation()}
                        className="inline-flex items-center justify-center rounded p-0.5 text-primary-500 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-200"
                        aria-label={`Remover ${file.name}`}
                      >
                        <Icon
                          className="w-3 h-3 p-0 color-primary-500"
                          type="deleteRed"
                          size="sm"
                        />
                      </button>
                    </div>
                  </div>

                  <ProgressBar value={progressValue} className={isError ? 'bg-red-100' : ''} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {errors.length > 0 && (
        <div className="mt-4">
          <div className="font-medium mb-2 text-red-500">Upload Errors:</div>
          <ul className="space-y-1">
            {errors.map((error) => (
              <li key={error} className="text-sm text-red-600">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
