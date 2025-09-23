import React from 'react';
import Icon from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type ButtonDropdownProps = {
  button: React.ReactNode;
  content: React.ReactNode;
};

export default function ButtonDropdown({ button, content }: ButtonDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[200px] justify-between font-medium text-xs rounded-2xl border border-gray-450 text-gray-450 px-3 py-1 h-fit data -[state=open]:shadow-md data-[state=open]:rounded-b-none data-[state=open]:border-b-0"
          >
            {button}
            <Icon
              type="chevronDown"
              className={`p-0 w-3 h-3 ${isOpen ? 'rotate-180' : ''}`}
              size="sm"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="overflow-hidden p-0 pt-1 bg-white text-xs z-0 border border-[#A9ABAD] border-t-0 rounded-t-none w-[200px] relative before:content-[''] before:absolute before:top-[3px] before:left-3 before:w-[calc(100%_-_24px)] before:h-[1px] before:bg-black"
          align="start"
          sideOffset={-1}
        >
          {content}
        </PopoverContent>
      </Popover>
    </div>
  );
}
