import React, { useCallback, useMemo } from 'react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';

import { formatText } from '~utils/intl';
import { BatchPaymentsTableModel } from './types';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types';
import TokenSelect from '../TokenSelect';
import UserSelect from '../UserSelect';
import AmountField from '../AmountField';

export const useBatchPaymentsTableColumns = (
  name: string,
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
        cell: ({ row }) => (
          <UserSelect key={row.id} name={`${name}.${row.index}.recipient`} />
        ),
      }),
      columnHelper.display({
        id: 'amount',
        header: () => formatText({ id: 'table.row.amount' }),
        cell: ({ row }) => (
          <AmountField key={row.id} name={`${name}.${row.index}.amount`} />
        ),
      }),
      columnHelper.display({
        id: 'token',
        header: () => formatText({ id: 'table.row.token' }),
        cell: ({ row }) => <TokenSelect name={`${name}.${row.index}.token`} />,
      }),
    ],
    [columnHelper, name],
  );

  return columns;
};

export const useGetTableMenuProps = ({ remove }) =>
  useCallback<
    TableWithMeatballMenuProps<BatchPaymentsTableModel>['getMenuProps']
  >(
    ({ index }) => ({
      cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
      items: [
        {
          key: 'remove',
          onClick: () => remove(index),
          label: formatText({ id: 'table.row.remove' }),
          iconName: 'trash',
        },
      ],
    }),
    [remove],
  );
