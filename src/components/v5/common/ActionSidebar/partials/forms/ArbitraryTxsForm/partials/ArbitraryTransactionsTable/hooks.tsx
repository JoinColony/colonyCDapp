import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { formatText } from '~utils/intl.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import { type AddTransactionTableModel } from '~v5/common/ActionSidebar/partials/forms/ArbitraryTxsForm/types.ts';

export const useArbitraryTxsTableColumns = (): ColumnDef<
  AddTransactionTableModel,
  string
>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<AddTransactionTableModel>(),
    [],
  );

  const hasNoDecisionMethods = useHasNoDecisionMethods();

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
      columnHelper.accessor('json', {
        enableSorting: false,
        header: () => (
          <span className="text-sm text-gray-600">
            {formatText({ id: 'table.row.details' })}
          </span>
        ),
        cell: ({ getValue }) => (
          <span
            className={clsx(
              'block max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-md font-normal',
              {
                'text-gray-700': !hasNoDecisionMethods,
                'text-gray-300': hasNoDecisionMethods,
              },
            )}
          >
            {getValue()}
          </span>
        ),
        size: 67,
      }),
    ],
    [columnHelper, hasNoDecisionMethods],
  );

  return columns;
};
