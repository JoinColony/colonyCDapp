import { type TableProps } from '../Table/types.ts';

import type React from 'react';

export interface TableWithActionsHeaderProps<
  TData,
  TProps extends TableProps<TData> = TableProps<TData>,
> {
  title: React.ReactNode;
  additionalHeaderContent?: React.ReactNode;
  headerClassName?: string;
  emptyContent?: React.ReactNode;
  tableProps: TProps;
  tableComponent?: React.ComponentType<TProps>;
}
