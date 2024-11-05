import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { formatText } from '~utils/intl.ts';
import { type AddTransactionTableModel } from '~v5/common/ActionSidebar/partials/forms/ArbitraryTxsForm/types.ts';

export const useArbitraryTxsTableColumns = (): ColumnDef<
  AddTransactionTableModel,
  string
>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<AddTransactionTableModel>(),
    [],
  );

  const columns: ColumnDef<AddTransactionTableModel, string>[] = useMemo(
    () => [
      columnHelper.accessor('contract', {
        enableSorting: false,
        header: () => (
          <span className="text-sm text-gray-600">
            {formatText({ id: 'table.row.contract' })}
          </span>
        ),
        cell: ({ getValue }) => (
          <span className="max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-md font-normal">
            {getValue()}
          </span>
        ),
        size: 35,
      }),
      columnHelper.accessor('method', {
        enableSorting: false,
        header: () => (
          <span className="text-sm text-gray-600">
            {formatText({ id: 'table.row.details' })}
          </span>
        ),
        cell: ({ row: { original } }) => (
          <div>
            <span
              className={clsx(
                'block max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-md font-normal',
              )}
            >
              <b>Method:</b> {original.method}
            </span>
            <span
              className={clsx(
                'block max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-md font-normal',
              )}
            >
              <b>_to (address):</b> {original.to}
            </span>
            <span
              className={clsx(
                'block max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-md font-normal',
              )}
            >
              <b>_amount (uint256):</b> {original.amount}
            </span>
          </div>
        ),
        size: 67,
      }),
    ],
    [columnHelper],
  );

  return columns;
};
