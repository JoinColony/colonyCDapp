import { ColumnDef } from '@tanstack/react-table';
import { MessageDescriptor } from 'react-intl';

export interface TableProps<T> {
  className?: string;
  tableTitle?: MessageDescriptor;
  data: T[];
  columns: ColumnDef<T, any>[];
}
