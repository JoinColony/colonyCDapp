import React, { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';

import { TransactionTableProps } from './types';
import UserSelect from '../UserSelect';
import AmountField from '../AmountField';

export const useTransactionTable = () => {
  const columnHelper = createColumnHelper<TransactionTableProps>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('recipent', {
        header: () => 'Recipient',
        cell: ({ row }) => (
          <UserSelect
            key={row.id}
            name={`payments[${row.index}].recipent`}
            selectedWalletAddress={row.original.recipent}
          />
        ),
      }),
      columnHelper.accessor('amount', {
        header: () => 'Amount',
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
    [columnHelper],
  );

  return {
    columns,
  };
};
