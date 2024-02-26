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
