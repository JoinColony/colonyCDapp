import React, { useMemo, useCallback } from 'react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types';

import { TransactionTableModel } from './types';
import UserSelect from '../UserSelect';
import AmountField from '../AmountField';

export const useTransactionTableColumns = (
  name: string,
): ColumnDef<TransactionTableModel, string>[] => {
  const intl = useIntl();
  const columnHelper = useMemo(
    () => createColumnHelper<TransactionTableModel>(),
    [],
  );

  const columns: ColumnDef<TransactionTableModel, string>[] = useMemo(
    () => [
      columnHelper.accessor('recipent', {
        header: () => intl.formatMessage({ id: 'table.row.recipent' }),
        cell: ({ row }) => (
          <UserSelect
            name={`${name}.${row.index}.recipent`}
            selectedWalletAddress={row.original.recipent}
          />
        ),
      }),
      columnHelper.accessor('amount', {
        header: () => intl.formatMessage({ id: 'table.row.amount' }),
        cell: ({ row }) => {
          return (
            <AmountField
              name={`${name}.${row.index}.amount`}
              defaultToken={row.original.token}
            />
          );
        },
      }),
    ],
    [intl, columnHelper, name],
  );

  return columns;
};

export const useGetTableMenuProps = (fieldArrayMethods) => {
  const intl = useIntl();

  return useCallback<
    TableWithMeatballMenuProps<TransactionTableModel>['getMenuProps']
  >(
    ({ index, original }) => ({
      items: [
        {
          key: 'duplicate',
          onClick: () =>
            fieldArrayMethods.insert(index, {
              ...original,
              key: uuidv4(),
            }),
          label: intl.formatMessage({ id: 'table.row.duplicate' }),
          iconName: 'copy-simple',
        },
        {
          key: 'remove',
          onClick: () => fieldArrayMethods.remove(index),
          label: `${index} - ${intl.formatMessage({ id: 'table.row.remove' })}`,
          iconName: 'trash',
        },
      ],
    }),
    [intl, fieldArrayMethods],
  );
};
