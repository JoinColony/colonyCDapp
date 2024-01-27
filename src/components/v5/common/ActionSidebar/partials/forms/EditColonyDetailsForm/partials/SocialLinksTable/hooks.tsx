import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useCallback } from 'react';

import { formatText } from '~utils/intl.ts';
import { TableWithMeatballMenuProps } from '~v5/common/TableWithMeatballMenu/types.ts';

import { SocialLinksTableModel } from './types.ts';

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
          <span className="text-gray-700 font-normal text-md overflow-ellipsis overflow-hidden whitespace-nowrap block">
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

export const useGetTableMenuProps = (
  { remove },
  setSocialLinkIndex: (index: number) => void,
) => {
  return useCallback<
    TableWithMeatballMenuProps<SocialLinksTableModel>['getMenuProps']
  >(
    ({ index }) => ({
      cardClassName: 'min-w-[9.625rem] whitespace-nowrap',
      items: [
        {
          key: 'edit',
          onClick: () => {
            setSocialLinkIndex(index);
          },
          label: formatText({ id: 'table.row.edit.link' }),
          icon: 'edit-pencil',
        },
        {
          key: 'remove',
          onClick: () => remove(index),
          label: formatText({ id: 'button.delete' }),
          icon: 'trash',
        },
      ],
    }),
    [setSocialLinkIndex, remove],
  );
};
