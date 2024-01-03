import { TableOptions, Row, Cell } from '@tanstack/react-table';
import React from 'react';

export type RenderCellWrapper<T> = (
  classNames: string,
  content: React.ReactNode,
  context: {
    cell: Cell<T, unknown>;
    row: Row<T>;
    renderDefault: () => React.ReactNode;
  },
) => React.ReactNode;

export interface TableProps<T>
  extends Omit<TableOptions<T>, 'getCoreRowModel'> {
  getCoreRowModel?: TableOptions<T>['getCoreRowModel'];
  className?: string;
  getRowClassName?: (row: Row<T>) => string | undefined;
  verticalOnMobile?: boolean;
  hasPagination?: boolean;
  sizeUnit?: 'px' | 'rem' | 'em' | '%';
  canNextPage?: boolean;
  canPreviousPage?: boolean;
  previousPage?: VoidFunction;
  nextPage?: VoidFunction;
  showPageNumber?: boolean;
  showTotalPagesNumber?: boolean;
  paginationDisabled?: boolean;
  renderCellWrapper?: RenderCellWrapper<T>;
  additionalPaginationButtonsContent?: React.ReactNode;
  emptyContent?: React.ReactNode;
}
