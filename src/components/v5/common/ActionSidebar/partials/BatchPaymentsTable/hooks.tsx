import {
  createColumnHelper,
  type Row,
  type ColumnDef,
} from '@tanstack/react-table';
import { useMemo } from 'react';

import { formatText } from '~utils/intl.ts';
import { makeMenuColumn } from '~v5/common/Table/utils.tsx';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

import { type BatchPaymentsTableModel } from './types.ts';

export const useBatchPaymentsTableColumns = (
  getMenuProps: (
    row: Row<BatchPaymentsTableModel>,
  ) => MeatBallMenuProps | undefined,
): ColumnDef<BatchPaymentsTableModel, string>[] => {
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
      makeMenuColumn({
        helper: columnHelper,
        getMenuProps,
      }),
    ],
    [columnHelper, getMenuProps],
  );

  return columns;
};
