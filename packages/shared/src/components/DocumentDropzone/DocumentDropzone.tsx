import Icon, { type IconType } from '@/components/Icon';
import { ContextMenu, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';
import { ProgressBar } from '@/components/ui/progress-bar';
import { cn } from '@/lib/utils';
import { ContextMenuTrigger } from '@radix-ui/react-context-menu';
import type React from 'react';
import { type DocumentFile, useDocumentDropzone } from './hooks/useDocumentDropzone';

interface DocumentDropzoneProps {
  files?: DocumentFile[];
  dragActive?: boolean;
  errors?: string[];
  inputRef?: React.RefObject<HTMLInputElement>;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick?: () => void;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  acceptedFileExtensions?: string;
  className?: string;
}

export default function DocumentDropzone({ className, ...props }: DocumentDropzoneProps) {
  // Use internal hook if no props provided (uncontrolled)
  const internalDropzone = useDocumentDropzone();

  // Use props if provided (controlled), otherwise use internal hook
  const {
    files = internalDropzone.files,
    dragActive = internalDropzone.dragActive,
    errors = internalDropzone.errors,
    inputRef = internalDropzone.inputRef,
    onDrop = internalDropzone.onDrop,
    onDragOver = internalDropzone.onDragOver,
    onDragLeave = internalDropzone.onDragLeave,
    onClick = internalDropzone.onClick,
    onFileChange = internalDropzone.onFileChange,
    acceptedFileExtensions = internalDropzone.acceptedFileExtensions
  } = props || {};

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
      <ContextMenu>
        <ContextMenuTrigger
          className={cn(
            `flex flex-col gap-6 rounded-lg border-2 border-dashed p-8 2xl:flex-row 2xl:gap-8`,
            dragActive ? 'border-primary-500 bg-primary-100' : 'border-gray-400 bg-white',
            className
          )}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <div className="flex space-x-6">
            <Icon type="upload" className="p-0" />

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
              className="w-full flex flex-col items-center justify-center min-h-[100px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
            >
              <div className="flex flex-col gap-2">
                <p className="font-bold">Anexar documento ou imagem</p>
                <span className="text-sm">Arraste ou cole o ficheiro a carregar</span>
                <span className="text-xs text-gray-400">
                  Apenas ficheiros JPEG, PNG e DOCX, até 4MB no total
                </span>
              </div>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {files.map((file) => (
              <div key={file.name} className="flex gap-6">
                <div className="flex flex-col gap-3 lg:min-w-80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 p-0" type={getFileIconType(file.name)} />
                      <p className="text-sm">{file.name}</p>
                      <span className="text-gray-400 font-light text-xs">({file.size})</span>
                    </div>

                    <Icon
                      className="w-3 h-3 p-0 cursor-pointer color-primary-500"
                      type="deleteRed"
                      size="sm"
                    />
                  </div>

                  <ProgressBar value={100} />
                </div>
              </div>
            ))}
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-fit bg-white">
          <ContextMenuItem inset>Colar</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

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
