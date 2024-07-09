import { createColumnHelper } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { useMobile } from '~hooks';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import { type CustomPermissionTableModel } from '~types/permissions.ts';
import { formatText } from '~utils/intl.ts';
import { FormSwitch } from '~v5/common/Fields/Switch/index.ts';

const customPermissionsColumnHelper =
  createColumnHelper<CustomPermissionTableModel>();

export const useCustomPermissionsTableColumns = (name: string) => {
  const isMobile = useMobile();

  const memoizedTableColumns = useMemo(
    () => [
      customPermissionsColumnHelper.accessor('type', {
        staticSize: isMobile ? '6.125rem' : '8.25rem',
        enableSorting: false,
        header: formatText({ id: 'table.column.type' }),
        cell: ({
          getValue,
          row: {
            original: { tooltipContent },
          },
        }) => {
          const content = (
            <span className="text-md font-medium text-gray-900">
              {getValue()}
            </span>
          );

          return tooltipContent ? (
            <Tooltip
              tooltipContent={tooltipContent}
              className="!inline-flex"
              offset={isMobile ? [-10, 12] : undefined}
              placement={isMobile ? 'bottom-start' : 'right'}
            >
              {content}
            </Tooltip>
          ) : (
            content
          );
        },
      }),
      customPermissionsColumnHelper.accessor('overview', {
        enableSorting: false,
        header: formatText({ id: 'table.column.overview' }),
        cell: ({ getValue }) => (
          <span className="text-md text-gray-600">{getValue()}</span>
        ),
      }),
    ],
    [isMobile, name],
  );

  return [
    ...memoizedTableColumns,
    customPermissionsColumnHelper.display({
      staticSize: '4.375rem',
      id: 'enabled',
      header: formatText({ id: 'table.column.enable' }),
      cell: ({ row }) => (
        <FormSwitch name={`${name}.role_${row.original.name}`} />
      ),
    }),
  ];
};
