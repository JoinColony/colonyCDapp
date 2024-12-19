import {
  createColumnHelper,
  type Row,
  type ColumnDef,
} from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { useMobile } from '~hooks';
import { type SocialLinksTableModel } from '~types/colony.ts';
import { formatText } from '~utils/intl.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import { makeMenuColumn } from '~v5/common/Table/refactoring/utils.tsx';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

export const useSocialLinksTableColumns = (
  getMenuProps?: (
    row: Row<SocialLinksTableModel>,
  ) => MeatBallMenuProps | undefined,
): ColumnDef<SocialLinksTableModel, string>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<SocialLinksTableModel>(),
    [],
  );

  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const isMobile = useMobile();

  const menuColumn = useMemo(
    () =>
      getMenuProps
        ? makeMenuColumn({
            helper: columnHelper,
            getMenuProps,
            cellProps: {
              size: isMobile ? 60 : 10,
            },
          })
        : null,
    [getMenuProps, columnHelper, isMobile],
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
        cellContentWrapperClassName: 'flex justify-between',
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

  return menuColumn ? [...columns, menuColumn] : columns;
};
