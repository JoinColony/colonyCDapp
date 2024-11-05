import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import { type AddTransactionTableModel } from '~v5/common/ActionSidebar/partials/forms/ArbitraryTxsForm/types.ts';
import AvatarWithAddress from '~v5/common/AvatarWithAddress/index.ts';

import CellDescription from './CellDescription.tsx';

export const useArbitraryTxsTableColumns = (): ColumnDef<
  AddTransactionTableModel,
  string
>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<AddTransactionTableModel>(),
    [],
  );
  const isMobile = useMobile();

  const columns: ColumnDef<AddTransactionTableModel, string>[] = useMemo(
    () => [
      columnHelper.accessor('contract', {
        enableSorting: false,
        header: () => (
          <span className="text-sm text-gray-600">
            {formatText({ id: 'table.row.contract' })}
          </span>
        ),
        cellContentWrapperClassName: '!justify-start',

        cell: ({ getValue }) => {
          const address = getValue();
          return (
            <span className="flex max-w-full  self-start overflow-hidden overflow-ellipsis whitespace-nowrap text-md font-normal">
              <AvatarWithAddress address={address} />
            </span>
          );
        },
        size: isMobile ? 100 : 30,
      }),
      columnHelper.display({
        id: 'description',
        header: () => (
          <span className="text-sm text-gray-600">
            {formatText({ id: 'table.row.details' })}
          </span>
        ),
        cell: ({ row: { original } }) => (
          <CellDescription
            data={[
              {
                title: 'Method',
                value: original.method,
              },
              {
                title: '_to (address)',
                value: original.to,
              },
              {
                title: '_amount (uint256)',
                value: original.amount,
              },
            ]}
          />
        ),
        size: isMobile ? 100 : 67,
      }),
    ],
    [columnHelper],
  );

  return columns;
};
