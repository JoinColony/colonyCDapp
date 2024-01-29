import React from 'react';

import { TableWithMeatballMenuProps } from '../TableWithMeatballMenu/types.ts';

export interface TableWithHeaderAndMeatballMenuProps<T>
  extends TableWithMeatballMenuProps<T> {
  title: React.ReactNode;
  additionalHeaderContent?: React.ReactNode;
  headerClassName?: string;
  emptyContent?: React.ReactNode;
}
