import { cn } from '@/lib/utils';

interface CardItemLabelProps {
  title: string;
  text: string;
  className?: string;
}

const CardItemLabel: React.FC<CardItemLabelProps> = ({ title, text, className }) => {
  return (
    <div className={cn('text-gray-800', className)}>
      <span className="text-xs opacity-55 font-semibold">{title}</span>
      <p className="uppercase font-semibold">{text}</p>
    </div>
  );
};

export default CardItemLabel;
