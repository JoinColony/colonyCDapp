import React, { useMemo } from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import TokenTable from '../TokenTable';
import { FundsTableModel } from './types';

export const useFundsTableColumns = (): ColumnDef<
  FundsTableModel,
  string
>[] => {
  const columnHelper = useMemo(() => createColumnHelper<FundsTableModel>(), []);

  const columns: ColumnDef<FundsTableModel, string>[] = useMemo(
    () => [
      columnHelper.display({
        id: 'token',
        cell: ({ row }) => <TokenTable token={row.original.token} />,
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnHelper],
  );

  return columns;
};
