import { createColumnHelper } from '@tanstack/react-table';
import chunk from 'lodash/chunk';
import React, { useMemo } from 'react';

import { UserRole, PERMISSIONS_TABLE_CONTENT } from '~constants/permissions.ts';
import { type PermissionsTableModel } from '~types/permissions.ts';
import { formatText } from '~utils/intl.ts';
import { type TableProps } from '~v5/common/Table/types.ts';

const permissionsColumnHelper = createColumnHelper<PermissionsTableModel>();

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
                  <span className="text-md font-medium text-gray-900">
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
                      <span className="mb-3 inline-block text-md text-gray-600">
                        {formatText({
                          id: 'actionSidebar.managePermissions.tableDescriptionHeading',
                        })}
                      </span>
                      <div className="flex w-full gap-4">
                        {permissionsColumns.map((column) => (
                          <ul
                            key={JSON.stringify(column)}
                            className="flex-1 list-disc pl-6"
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
