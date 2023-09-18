import { TableOptions } from '@tanstack/react-table';

export interface TableProps<T> extends TableOptions<T> {
  className?: string;
  title?: React.ReactNode;
}
