import { cn } from '@/lib/utils';

export interface CardItemLabelProps {
  title: string;
  text: string;
  className?: string;
  dataTestId?: string;
}

const CardItemLabel: React.FC<CardItemLabelProps> = ({ title, text, className, dataTestId }) => {
  return (
    <div className={cn('text-gray-800', className)} data-testid={dataTestId}>
      <span className="text-xs opacity-55 font-semibold">{title}</span>
      <p className="uppercase font-semibold">{text}</p>
    </div>
  );
};

export default CardItemLabel;
