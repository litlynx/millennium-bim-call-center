import type { ReactNode } from 'react';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

interface TableHeaderData {
  key: string;
  label: string;
  className?: string;
  boldColumn?: boolean;
}

interface TableCellData {
  content: ReactNode;
  className?: string;
}

export interface TableRowData {
  id: string;
  cells: TableCellData[];
  className?: string;
}

interface TableComponentProps {
  headers: TableHeaderData[];
  data: TableRowData[];
}

const TableComponent: React.FC<TableComponentProps> = ({ headers, data }) => {
  const [tableHeight, setTableHeight] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const filterRef = React.useRef<HTMLDivElement>(null);

  const updateHeight = React.useCallback(() => {
    if (containerRef.current && filterRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const filterRect = filterRef.current.getBoundingClientRect();

      const availableHeight = containerRect.height - filterRect.height;

      setTableHeight(Math.max(availableHeight, 0));
    }
  }, []);

  React.useEffect(() => {
    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, [updateHeight]);

  return (
    <div className="flex flex-col h-full" ref={containerRef}>
      <div className="flex-1 min-h-0">
        <ScrollArea
          className="h-full"
          style={{
            height: tableHeight !== null ? `${tableHeight}px` : 'fit-content'
          }}
        >
          <Table className="w-full mb-3 mt-3">
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead
                    key={header.key}
                    className={cn(
                      'font-semibold text-xs leading-tight text-gray-800 sticky top-0 z-10 uppercase',
                      header.className,
                      index < headers.length - 1 && 'pr-4'
                    )}
                  >
                    {header.label ?? ''}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} className={row.className}>
                  {row.cells.map((cell, cellIndex) => {
                    const col = headers[cellIndex];
                    const cellClasses = [
                      cell.className ?? '',
                      col?.boldColumn ? 'font-semibold' : ''
                    ]
                      .filter(Boolean)
                      .join(' ');

                    return (
                      <TableCell
                        key={`${row.id}-${col?.key ?? cellIndex}`}
                        className={cn(
                          'text-gray-600 text-xs leading-tight font-medium py-2',
                          row.cells.length - 1 !== cellIndex && 'pr-3',
                          cellClasses
                        )}
                      >
                        {cell.content}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <ScrollBar
            forceMount
            className="w-2 p-0 rounded-full bg-gray-300/35 [&>div]:bg-primary-500 [&>div]:rounded-full"
          />
          <ScrollBar
            orientation="horizontal"
            forceMount
            className="h-2 p-0 rounded-full bg-gray-300/35 [&>div]:bg-primary-500 [&>div]:rounded-full"
          />
        </ScrollArea>
      </div>
    </div>
  );
};

export default TableComponent;
