import { TableOptions } from '@tanstack/react-table';

export interface TableProps<T>
  extends Omit<TableOptions<T>, 'getCoreRowModel'> {
  getCoreRowModel?: TableOptions<T>['getCoreRowModel'];
  className?: string;
  isError?: boolean;
  title?: React.ReactNode;
}
