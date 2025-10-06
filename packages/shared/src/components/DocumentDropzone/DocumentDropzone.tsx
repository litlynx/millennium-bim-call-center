import { ContextMenuTrigger } from '@radix-ui/react-context-menu';
import type React from 'react';
import Icon from '@/components/Icon';
import { ContextMenu, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';

const DocumentDropzone: React.FC = () => {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] items-center justify-center rounded-md border border-dashed text-sm">
        <div className="flex">
          <Icon type="block" />
          <div className="flex space-y-2">
            <p className="font-bold">Anexar documento ou imagem</p>
            <span>Arraste ou cole o ficheiro a carregar</span>
            <span>Apenas ficheiros JPEG, PNG e DOCX, até 4MB no total</span>
          </div>
        </div>
        <div className="space-x-4">
          <div>
            <Icon type="block" />
            <p>Prints ICBS do Cliente.png</p>
            <span>(321KB)</span>
            <p>Progress bar</p>
          </div>
          <Icon type="block" />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem inset>Colar</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default DocumentDropzone;
