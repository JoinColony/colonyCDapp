import React from 'react';
import { TableProps } from '../Table/types';

export interface TableWithActionsHeaderProps<T> extends TableProps<T> {
  title: React.ReactNode;
  additionalHeaderContent?: React.ReactNode;
  headerClassName?: string;
  emptyContent?: React.ReactNode;
}
