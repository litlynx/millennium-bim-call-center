import { ContextMenuTrigger } from '@radix-ui/react-context-menu';
import type React from 'react';
import Icon from '@/components/Icon';
import { ContextMenu, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';

const DocumentDropzone: React.FC = () => {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex flex-col gap-6 rounded-lg border-2 border-dashed border-[#AAADB8] p-8 lg:flex-row lg:gap-14">
        <div className="flex space-x-6">
          <Icon type="block" />
          <div className="flex flex-col gap-2">
            <p className="font-bold">Anexar documento ou imagem</p>
            <span className="text-sm">Arraste ou cole o ficheiro a carregar</span>
            <span className="text-xs text-[#767676]">
              Apenas ficheiros JPEG, PNG e DOCX, até 4MB no total
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-6">
            <div className="flex flex-col gap-3 lg:min-w-80">
              <div className="flex gap-2 items-center">
                <Icon className="w-4 h-4 p-0" type="block" />
                <p className="text-sm">Prints ICBS do Cliente.png</p>
                <span className="text-[#767676] font-light text-xs">(321KB)</span>
              </div>
              <div className="w-full h-1 bg-primary-500 rounded-full"></div>
            </div>
            <Icon className="w-3 h-3 p-0" type="block" size="sm" />
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col gap-3 lg:min-w-80">
              <div className="flex gap-2 items-center">
                <Icon className="w-4 h-4 p-0" type="block" />
                <p className="text-sm">Prints ICBS do Cliente.png</p>
                <span className="text-[#767676] font-light text-xs">(321KB)</span>
              </div>
              <div className="w-full h-1 bg-primary-500 rounded-full"></div>
            </div>
            <Icon className="w-3 h-3 p-0" type="block" size="sm" />
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-fit bg-white">
        <ContextMenuItem inset>Colar</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default DocumentDropzone;
