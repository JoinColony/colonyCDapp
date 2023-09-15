import { ColumnDef } from '@tanstack/react-table';

export interface TableProps<T> {
  className?: string;
  tableTitle?: React.ReactNode;
  columns: ColumnDef<T>[];
  fields: Record<'id', string>[];
}
