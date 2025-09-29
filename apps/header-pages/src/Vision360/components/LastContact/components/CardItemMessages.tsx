import { Icon } from 'shared/components';

export interface CardItemMessagesProps {
  date: string;
  time: string;
  message: string;
  dataTestId?: string;
}

export const CardItemMessages: React.FC<CardItemMessagesProps> = ({
  date,
  time,
  message,
  dataTestId
}) => {
  return (
    <div className="flex gap-2 p-4 pl-0" data-testid={dataTestId}>
      <Icon type="message" size="sm" rounded className="bg-primary-600 aspect-square" />
      <div className="flex flex-col">
        <span className="text-gray-800 opacity-55 text-xs font-semibold">
          {date} | {time}
        </span>
        <p className="text-gray-800 font-medium">{message}</p>
      </div>
    </div>
  );
};
