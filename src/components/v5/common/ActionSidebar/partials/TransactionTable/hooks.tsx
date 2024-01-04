import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { formatText } from '~utils/intl';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types';

import AmountField from '../AmountField';
import UserSelect from '../UserSelect';

import { TransactionTableModel } from './types';

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
