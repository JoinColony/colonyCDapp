import {
  createColumnHelper,
  type Row,
  type ColumnDef,
} from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import { makeMenuColumn } from '~v5/common/Table/utils.tsx';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

import AmountField from '../AmountField/index.ts';
import UserSelect from '../UserSelect/index.ts';

import { type TransactionTableModel } from './types.ts';

export const useTransactionTableColumns = (
  name: string,
  getMenuProps: (
    row: Row<TransactionTableModel>,
  ) => MeatBallMenuProps | undefined,
): ColumnDef<TransactionTableModel, string>[] => {
  const { watch } = useFormContext();
  const selectedTeam = watch('from');

  const columnHelper = useMemo(
    () => createColumnHelper<TransactionTableModel>(),
    [],
  );

  const menuColumn: ColumnDef<TransactionTableModel, string> = useMemo(
    () =>
      makeMenuColumn({
        helper: columnHelper,
        getMenuProps,
      }),
    [columnHelper, getMenuProps],
  );

  const columns: ColumnDef<TransactionTableModel, string>[] = useMemo(
    () => [
      columnHelper.display({
        id: 'recipient',
        header: () => formatText({ id: 'table.row.recipient' }),
        cell: ({ row }) => (
          <UserSelect key={row.id} name={`${name}.${row.index}.recipient`} />
        ),
      }),
      columnHelper.display({
        id: 'amount',
        header: () => formatText({ id: 'table.row.amount' }),
        cell: ({ row }) => (
          <AmountField
            key={row.id}
            name={`${name}.${row.index}.amount`}
            domainId={selectedTeam}
          />
        ),
      }),
    ],
    [columnHelper, name, selectedTeam],
  );

  return menuColumn ? [...columns, menuColumn] : columns;
};
