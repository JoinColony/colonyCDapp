import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { type SocialLinksTableModel } from '~types/colony.ts';
import { formatText } from '~utils/intl.ts';

export const useSocialLinksTableColumns = (): ColumnDef<
  SocialLinksTableModel,
  string
>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<SocialLinksTableModel>(),
    [],
  );

  const columns: ColumnDef<SocialLinksTableModel, string>[] = useMemo(
    () => [
      columnHelper.accessor('name', {
        enableSorting: false,
        header: () => (
          <span className="text-sm text-gray-600">
            {formatText({ id: 'table.row.type' })}
          </span>
        ),
        cell: ({ getValue }) => (
          <span className="text-gray-900 text-1">{getValue()}</span>
        ),
        size: 23,
      }),
      columnHelper.accessor('link', {
        enableSorting: false,
        header: () => (
          <span className="text-sm text-gray-600">
            {formatText({ id: 'table.row.url' })}
          </span>
        ),
        cell: ({ getValue }) => (
          <span className="block overflow-hidden overflow-ellipsis whitespace-nowrap text-md font-normal text-gray-700">
            {getValue()}
          </span>
        ),
        size: 67,
      }),
    ],
    [columnHelper],
  );

  return columns;
};
