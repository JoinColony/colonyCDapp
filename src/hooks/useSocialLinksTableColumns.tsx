import {
  createColumnHelper,
  type Row,
  type ColumnDef,
} from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { ExternalLinks } from '~gql';
import { useMobile } from '~hooks';
import { type SocialLinksTableModel } from '~types/colony.ts';
import { formatText } from '~utils/intl.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import { makeMenuColumn } from '~v5/common/Table/utils.tsx';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

const LINK_NAME_OVERRIDES: Partial<Record<ExternalLinks, string>> = {
  [ExternalLinks.Twitter]: 'X',
};

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
              staticSize: isMobile ? '60px' : '10%',
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
            {LINK_NAME_OVERRIDES[getValue()] ?? getValue()}
          </span>
        ),
        staticSize: isMobile ? '118px' : '23%',
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
        staticSize: isMobile ? '67px' : '67%',
      }),
    ],
    [columnHelper, hasNoDecisionMethods, isMobile],
  );

  return menuColumn ? [...columns, menuColumn] : columns;
};
