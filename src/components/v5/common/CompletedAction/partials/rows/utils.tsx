import { type ColonyRole } from '@colony/colony-js';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

import { type CustomPermissionTableModel } from '~types/permissions.ts';
import { formatText } from '~utils/intl.ts';
import Switch from '~v5/common/Fields/Switch/index.ts';

const customPermissionsColumnHelper =
  createColumnHelper<CustomPermissionTableModel>();

export const getCustomPermissionsTableColumns = (
  userColonyRoles: ColonyRole[],
) => [
  customPermissionsColumnHelper.accessor('type', {
    staticSize: '8.25rem',
    enableSorting: false,
    header: formatText({ id: 'table.column.type' }),
    cell: ({ getValue }) => (
      <span className="text-md font-medium text-gray-900">{getValue()}</span>
    ),
  }),
  customPermissionsColumnHelper.accessor('overview', {
    enableSorting: false,
    header: formatText({ id: 'table.column.overview' }),
    cell: ({ getValue }) => (
      <span className="text-md text-gray-600">{getValue()}</span>
    ),
  }),
  customPermissionsColumnHelper.display({
    staticSize: '4.375rem',
    id: 'enabled',
    header: formatText({ id: 'table.column.enable' }),
    cell: ({ row }) => (
      <Switch
        readOnly
        checked={
          userColonyRoles.find((role) => role === row.original.key) !==
          undefined
        }
      />
    ),
  }),
];
