import { ContextMenuTrigger } from '@radix-ui/react-context-menu';
import type React from 'react';
import Icon, { type IconType } from '@/components/Icon';
import { ContextMenu, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';
import { ProgressBar } from '@/components/ui/progress-bar';

const mockFiles = [
  {
    id: 1,
    name: 'Prints ICBS do Cliente.png',
    size: '321KB',
    progress: 50
  },
  {
    id: 2,
    name: 'Bilhete_de_ Id.Pdf',
    size: '2MB',
    progress: 90
  }
];

interface DocumentDropzoneProps {
  className?: string;
}

const DocumentDropzone: React.FC<DocumentDropzoneProps> = ({
  className
}: DocumentDropzoneProps) => {
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
          className={`flex flex-col gap-6 rounded-lg border-2 border-dashed border-gray-400 p-8 2xl:flex-row 2xl:gap-8 ${className}`}
        >
          <div className="flex space-x-6">
            <Icon type="upload" className="p-0" />

            <div className="flex flex-col gap-2">
              <p className="font-bold">Anexar documento ou imagem</p>
              <span className="text-sm">Arraste ou cole o ficheiro a carregar</span>
              <span className="text-xs text-gray-400">
                Apenas ficheiros JPEG, PNG e DOCX, até 4MB no total
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {mockFiles.map((file) => (
              <div key={file.id} className="flex gap-6">
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

                  <ProgressBar value={file.progress} />
                </div>
              </div>
            ))}
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-fit bg-white">
          <ContextMenuItem inset>Colar</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <div className="text-red-500 text-sm mt-1">
        Ocorreu um erro ao anexar um arquivo. Tente novamente
      </div>
    </>
  );
};

export default DocumentDropzone;
