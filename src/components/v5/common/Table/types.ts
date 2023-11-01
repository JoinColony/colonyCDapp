import { TableOptions, Row } from '@tanstack/react-table';

export interface TableProps<T>
  extends Omit<TableOptions<T>, 'getCoreRowModel'> {
  getCoreRowModel?: TableOptions<T>['getCoreRowModel'];
  className?: string;
  getRowClassName?: (row: Row<T>) => string | undefined;
  verticalOnMobile?: boolean;
  hasPagination?: boolean;
}
