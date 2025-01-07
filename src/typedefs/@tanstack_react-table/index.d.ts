import { type ColumnMeta as BaseColumnMeta } from '@tanstack/react-table';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';

declare module '@tanstack/react-table' {
  export interface ColumnSizingColumnDef {
    staticSize?: string;
    colSpan?: ((isExpanded: boolean) => number | undefined) | number;
    cellContentWrapperClassName?: string;
    headCellClassName?: string;
  }
  export interface ColumnMeta<TData extends RowData, TValue>
    extends BaseColumnMeta<TData, TValue> {
    footer?: {
      colSpan?: number;
      display?: string;
    };
  }
}
