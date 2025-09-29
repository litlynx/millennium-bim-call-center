import * as React from 'react';
import type { DateRange } from 'react-day-picker';
import Icon from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
  onChange?: (range: { startDate: Date | null; endDate: Date | null }) => void;
}

export default function DatePicker({ onChange }: DatePickerProps) {
  const [range, setRange] = React.useState<DateRange | undefined>(undefined);

  function formatDate(date: Date) {
    return date.toLocaleDateString('pt-BR').replace(/\//g, '-');
  }

  return (
    <div className="flex flex-col gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[200px] justify-between font-bold text-xs rounded-2xl border border-[#A9ABAD] px-3 py-1 h-fit data-[state=open]:shadow-md data-[state=open]:rounded-b-none data-[state=open]:border-b-0"
          >
            {range?.from && range?.to
              ? `${formatDate(range.from)} - ${formatDate(range.to)}`
              : 'Select date'}
            <Icon type="calendar" className="p-0 w-3 h-3" size="sm" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="overflow-hidden p-0 pt-1 bg-white text-xs z-0 border border-[#A9ABAD] border-t-0 rounded-t-none w-[200px] relative before:content-[''] before:absolute before:top-[3px] before:left-3 before:w-[calc(100%_-_24px)] before:h-[1px] before:bg-black"
          align="start"
          sideOffset={-1}
        >
          <Calendar
            className="w-full"
            mode="range"
            selected={range}
            captionLayout="label"
            onSelect={(newRange) => {
              setRange(newRange);
              onChange?.({
                startDate: newRange?.from ?? null,
                endDate: newRange?.to ?? null
              });
            }}
            weekStartsOn={1}
            formatters={{
              formatWeekdayName: (date) => {
                const dias = ['D', '2ª', '3ª', '4ª', '5ª', '6ª', 'S'];
                return dias[date.getDay()];
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
