import { type TableWithMeatballMenuProps } from '../TableWithMeatballMenu/types.ts';

import type React from 'react';

export interface TableWithHeaderAndMeatballMenuProps<T>
  extends TableWithMeatballMenuProps<T> {
  title: React.ReactNode;
  additionalHeaderContent?: React.ReactNode;
  headerClassName?: string;
  emptyContent?: React.ReactNode;
}
