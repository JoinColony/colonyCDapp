import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { useMobile } from '~hooks';
import { type SocialLinksTableModel } from '~types/colony.ts';
import { formatText } from '~utils/intl.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';

export const useSocialLinksTableColumns = (): ColumnDef<
  SocialLinksTableModel,
  string
>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<SocialLinksTableModel>(),
    [],
  );

  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const isMobile = useMobile();

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
          <span
            className={clsx('text-1', {
              'text-gray-900': !hasNoDecisionMethods,
              'text-gray-300': hasNoDecisionMethods,
            })}
          >
            {getValue()}
          </span>
        ),
        size: isMobile ? 118 : 23,
      }),
      columnHelper.accessor('link', {
        enableSorting: false,
        header: () => (
          <span className="text-sm text-gray-600">
            {formatText({ id: 'table.row.url' })}
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
    [columnHelper, hasNoDecisionMethods, isMobile],
  );

  return columns;
};
