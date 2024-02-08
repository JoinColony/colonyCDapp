import { type ColonyRole } from '@colony/colony-js';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

import { formatText } from '~utils/intl.ts';
import { type CustomPermissionTableModel } from '~v5/common/ActionSidebar/partials/forms/ManagePermissionsForm/partials/PermissionsTable/types.ts';
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
      <span className="text-md text-gray-900 font-medium">{getValue()}</span>
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
