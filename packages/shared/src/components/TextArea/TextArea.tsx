import type { FC } from 'react';
import Icon from '@/components/Icon';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const IconHeader: FC<{ className?: string; title: string }> = ({ className, title }) => {
  return (
    <div className={cn(`flex items-center justify-center rounded-full`, className)}>
      <Icon size="lg" type="documentLayout" className="bg-green-500 pr-[1rem] w-[2.75rem] h-auto" />
      <h1 className="font-bold">{title}</h1>
    </div>
  );
};

export default function TextArea() {
  return (
    <div>
      <IconHeader className="mb-2" title="Registo" />
      <Textarea className="textarea textarea-bordered w-full" />
    </div>
  );
}
