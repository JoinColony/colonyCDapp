import React, { useMemo, useCallback } from 'react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { formatText } from '~utils/intl';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types';

import { TransactionTableModel } from './types';
import UserSelect from '../UserSelect';
import AmountField from '../AmountField';

export const useTransactionTableColumns = (
  name: string,
  tokenAddress?: string,
): ColumnDef<TransactionTableModel, string>[] => {
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
          />
        ),
      }),
    ],
    [columnHelper, name, tokenAddress],
  );

  return columns;
};

export const useGetTableMenuProps = (
  { insert, remove },
  data,
  shouldShowMenu?: boolean,
) =>
  useCallback<
    TableWithMeatballMenuProps<TransactionTableModel>['getMenuProps']
  >(
    ({ index }) => {
      return shouldShowMenu
        ? {
            cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
            items: [
              {
                key: 'duplicate',
                onClick: () =>
                  insert(index + 1, {
                    ...data[index],
                  }),
                label: formatText({ id: 'table.row.duplicate' }),
                icon: 'copy-simple',
              },
              {
                key: 'remove',
                onClick: () => remove(index),
                label: formatText({ id: 'table.row.remove' }),
                icon: 'trash',
              },
            ],
          }
        : undefined;
    },
    [data, insert, remove, shouldShowMenu],
  );
