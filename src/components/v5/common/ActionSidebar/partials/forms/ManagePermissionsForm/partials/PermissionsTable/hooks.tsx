import { createColumnHelper } from '@tanstack/react-table';
import chunk from 'lodash/chunk';
import React, { useMemo } from 'react';

import { UserRole } from '~constants/permissions.ts';
import { formatText } from '~utils/intl.ts';
import { FormSwitch } from '~v5/common/Fields/Switch/index.ts';
import { type TableProps } from '~v5/common/Table/types.ts';

import { PERMISSIONS_TABLE_CONTENT } from './consts.tsx';
import {
  type CustomPermissionTableModel,
  type PermissionsTableModel,
} from './types.ts';

const customPermissionsColumnHelper =
  createColumnHelper<CustomPermissionTableModel>();
const permissionsColumnHelper = createColumnHelper<PermissionsTableModel>();

export const useCustomPermissionsTableColumns = (name: string) =>
  useMemo(
    () => [
      customPermissionsColumnHelper.accessor('type', {
        staticSize: '8.25rem',
        enableSorting: false,
        header: formatText({ id: 'table.column.type' }),
        cell: ({ getValue }) => (
          <span className="text-md text-gray-900 font-medium">
            {getValue()}
          </span>
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
          <FormSwitch name={`${name}.role_${row.original.name}`} />
        ),
      }),
    ],
    [name],
  );

export const usePermissionsTableProps = (
  selectedRole: UserRole | undefined,
): TableProps<PermissionsTableModel> => {
  return useMemo(
    () =>
      selectedRole && selectedRole !== UserRole.Custom
        ? {
            data: [
              {
                key: Date.now(),
                permissions:
                  PERMISSIONS_TABLE_CONTENT[selectedRole].permissions,
              },
            ],
            columns: [
              permissionsColumnHelper.accessor('permissions', {
                enableSorting: false,
                header: () => (
                  <span className="text-gray-900 text-md font-medium">
                    {PERMISSIONS_TABLE_CONTENT[selectedRole].heading}
                  </span>
                ),
                cell: ({ row }) => {
                  const permissionsColumns = chunk(
                    row.original.permissions,
                    Math.ceil(row.original.permissions.length / 2),
                  );

                  return (
                    <>
                      <span className="mb-3 text-gray-600 text-md inline-block">
                        {formatText({
                          id: 'actionSidebar.managePermissions.tableDescriptionHeading',
                        })}
                      </span>
                      <div className="flex gap-4 w-full">
                        {permissionsColumns.map((column) => (
                          <ul
                            key={JSON.stringify(column)}
                            className="list-disc pl-6 flex-1"
                          >
                            {column.map((permission) => (
                              <li
                                className="text-gray-600"
                                key={JSON.stringify(permission)}
                              >
                                {permission}
                              </li>
                            ))}
                          </ul>
                        ))}
                      </div>
                    </>
                  );
                },
              }),
            ],
          }
        : {
            data: [],
            columns: [],
          },
    [selectedRole],
  );
};
