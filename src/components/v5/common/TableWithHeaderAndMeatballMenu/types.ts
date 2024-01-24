import { type TableProps } from '../Table/types.ts';

import type React from 'react';

export interface TableWithHeaderAndMeatballMenuProps<T> extends TableProps<T> {
  title: React.ReactNode;
  additionalHeaderContent?: React.ReactNode;
  headerClassName?: string;
  emptyContent?: React.ReactNode;
}
