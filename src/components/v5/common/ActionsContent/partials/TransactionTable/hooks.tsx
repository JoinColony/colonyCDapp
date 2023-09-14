import React, { useMemo } from 'react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { useIntl } from 'react-intl';

import { TransactionTableProps } from './types';
import UserSelect from '../UserSelect';
import AmountField from '../AmountField';

export const useTransactionTable = () => {
  const { formatMessage } = useIntl();
  const columnHelper = createColumnHelper<TransactionTableProps>();

  const columns: ColumnDef<TransactionTableProps, string>[] = useMemo(
    () => [
      columnHelper.accessor('recipent', {
        header: () => formatMessage({ id: 'table.row.recipent' }),
        cell: ({ row }) => (
          <UserSelect
            key={row.id}
            name={`payments[${row.index}].recipent`}
            selectedWalletAddress={row.original.recipent}
          />
        ),
      }),
      columnHelper.accessor('amount', {
        header: () => formatMessage({ id: 'table.row.amount' }),
        cell: ({ row }) => {
          return (
            <AmountField
              key={row.id}
              name={`payments[${row.index}].amount`}
              amount={row.original.amount}
              defaultToken={row.original.token}
            />
          );
        },
      }),
    ],
    [],
  );

  return columns;
};
