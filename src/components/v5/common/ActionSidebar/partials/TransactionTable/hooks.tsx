import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';

import AmountField from '../AmountField/index.ts';
import UserSelect from '../UserSelect/index.ts';

import { type TransactionTableModel } from './types.ts';

export const useTransactionTableColumns = (
  name: string,
  tokenAddress?: string,
): ColumnDef<TransactionTableModel, string>[] => {
  const { watch } = useFormContext();
  const selectedTeam = watch('from');

  const columnHelper = useMemo(
    () => createColumnHelper<TransactionTableModel>(),
    [],
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
            tokenAddress={tokenAddress}
            teamId={selectedTeam}
          />
        ),
      }),
    ],
    [columnHelper, name, selectedTeam, tokenAddress],
  );

  return columns;
};
