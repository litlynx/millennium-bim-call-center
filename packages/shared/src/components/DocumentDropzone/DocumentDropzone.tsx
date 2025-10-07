import type { ChangeEvent, ClipboardEvent, DragEvent, RefObject } from 'react';

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
          className="w-full flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
        >
          <div className="flex space-x-6">
            <Icon type="upload" className="p-0" />

            <div className="flex flex-col gap-2 text-left">
              <p className="font-bold">Anexar documento ou imagem</p>
              <span className="text-sm">Arraste ou cole o ficheiro a carregar</span>
              <span className="text-xs text-gray-400">
                Apenas ficheiros JPEG, PNG, DOCX, PDF e TXT  até 4MB no total
              </span>
            </div>
          </div>
        </button>

        <div className="flex flex-col gap-4">
          {files.map((file) => {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
            return (
              <div key={file.name} className="flex gap-6">
                <div className="flex flex-col gap-3 lg:min-w-80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 pr-2">
                      <Icon className="w-4 h-4 p-0" type={getFileIconType(file.name)} />
                      <p className="text-sm">{file.name}</p>
                      <span className="text-nowrap text-gray-400 font-light text-xs">
                        ({sizeMB} MB)
                      </span>
                    </div>

                    <Icon
                      className="w-3 h-3 p-0 cursor-pointer color-primary-500"
                      type="deleteRed"
                      size="sm"
                      onClick={() => onRemoveFile(file)}
                    />
                  </div>

                  <ProgressBar value={100} />
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
