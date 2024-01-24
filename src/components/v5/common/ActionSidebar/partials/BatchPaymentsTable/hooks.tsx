import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

import { formatText } from '~utils/intl.ts';

import { type BatchPaymentsTableModel } from './types.ts';

export const useBatchPaymentsTableColumns = (): ColumnDef<
  BatchPaymentsTableModel,
  string
>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<BatchPaymentsTableModel>(),
    [],
  );

  const columns: ColumnDef<BatchPaymentsTableModel, string>[] = useMemo(
    () => [
      columnHelper.display({
        id: 'recipient',
        header: () => formatText({ id: 'table.row.recipient' }),
        cell: () => {
          // @TODO: display data
        },
      }),
      columnHelper.display({
        id: 'amount',
        header: () => formatText({ id: 'table.row.amount' }),
        cell: () => {
          // @TODO: display data
        },
      }),
      columnHelper.display({
        id: 'token',
        header: () => formatText({ id: 'table.row.token' }),
        cell: () => {
          // @TODO: display data
        },
      }),
    ],
    [columnHelper],
  );

  return columns;
};
