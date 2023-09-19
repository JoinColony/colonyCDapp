import React, { useMemo, useCallback } from 'react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { useIntl } from 'react-intl';
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
      columnHelper.display({
        id: 'recipent',
        header: () => intl.formatMessage({ id: 'table.row.recipent' }),
        cell: ({ row }) => (
          <UserSelect key={row.id} name={`${name}.${row.index}.recipent`} />
        ),
      }),
      columnHelper.display({
        id: 'amount',
        header: () => intl.formatMessage({ id: 'table.row.amount' }),
        cell: ({ row }) => {
          return (
            <AmountField
              key={row.id}
              name={`${name}.${row.index}.amount`}
              tokenFieldName={`${name}.${row.index}.token`}
            />
          );
        },
      }),
    ],
    [intl, columnHelper, name],
  );

  return columns;
};

export const useGetTableMenuProps = ({ insert, remove }, data) => {
  const intl = useIntl();

  return useCallback<
    TableWithMeatballMenuProps<TransactionTableModel>['getMenuProps']
  >(
    ({ index }) => ({
      cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
      items: [
        {
          key: 'duplicate',
          onClick: () =>
            insert(index + 1, {
              ...data[index],
            }),
          label: intl.formatMessage({ id: 'table.row.duplicate' }),
          iconName: 'copy-simple',
        },
        {
          key: 'remove',
          onClick: () => remove(index),
          label: intl.formatMessage({ id: 'table.row.remove' }),
          iconName: 'trash',
        },
      ],
    }),
    [data, insert, intl, remove],
  );
};
