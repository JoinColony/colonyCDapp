import { User, UsersThree } from '@phosphor-icons/react';
import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import chunk from 'lodash/chunk';
import React, { useMemo } from 'react';

import {
  UserRole,
  PERMISSIONS_TABLE_CONTENT,
  USER_ROLES,
  type UserRoleMeta,
} from '~constants/permissions.ts';
import { type PermissionsTableModel } from '~types/permissions.ts';
import { tw } from '~utils/css/index.ts';
import { formatText } from '~utils/intl.ts';
import { RemoveRoleOptionValue } from '~v5/common/ActionSidebar/partials/forms/ManagePermissionsForm/consts.ts';
import PermissionsBadge from '~v5/common/Pills/PermissionsBadge/PermissionsBadge.tsx';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';
import { type TableProps } from '~v5/common/Table/types.ts';

const permissionsColumnHelper = createColumnHelper<PermissionsTableModel>();

export const usePermissionsTableProps = (
  selectedRole: UserRole | RemoveRoleOptionValue | undefined,
  userRole?: UserRoleMeta,
  isCompletedAction?: boolean,
): TableProps<PermissionsTableModel> => {
  return useMemo(() => {
    const tableClassName = tw`[&_th]:h-[2.625rem] [&_th]:py-1`;

    const isRemovePermissionsAction =
      selectedRole && selectedRole === RemoveRoleOptionValue.remove;

    return selectedRole && selectedRole !== UserRole.Custom
      ? {
          className: tableClassName,
          data: [
            {
              key: Date.now(),
              permissions: isRemovePermissionsAction
                ? [userRole?.name]
                : PERMISSIONS_TABLE_CONTENT[selectedRole].permissions,
            },
          ],
          columns: [
            permissionsColumnHelper.accessor('permissions', {
              enableSorting: false,
              header: () =>
                isRemovePermissionsAction ? (
                  <div className="flex items-center gap-4">
                    <span className="text-md font-medium text-gray-900">
                      {formatText({
                        id: 'actionSidebar.managePermissions.tableHeadingRemovePermission',
                      })}
                    </span>
                    {userRole && (
                      <PermissionsBadge
                        text={
                          USER_ROLES.find(
                            ({ role: roleField }) =>
                              roleField === userRole.role,
                          )?.name || formatText({ id: 'role.custom' })
                        }
                        icon={
                          userRole.role !== UserRole.Custom ? User : UsersThree
                        }
                      />
                    )}
                  </div>
                ) : (
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
                      {isRemovePermissionsAction
                        ? formatText({
                            id: isCompletedAction
                              ? 'actionSidebar.managePermissions.tableDescriptionHeadingRemoveCompleted'
                              : 'actionSidebar.managePermissions.tableDescriptionHeadingRemove',
                          })
                        : formatText({
                            id: 'actionSidebar.managePermissions.tableDescriptionHeading',
                          })}
                    </span>
                    <div
                      className={clsx('flex w-full gap-4', {
                        'items-center': isRemovePermissionsAction,
                      })}
                    >
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
                      {isRemovePermissionsAction && (
                        <PillsBase className="bg-negative-100 text-negative-400">
                          {formatText({ id: 'badge.removed' })}
                        </PillsBase>
                      )}
                    </div>
                  </>
                );
              },
            }),
          ],
        }
      : {
          className: tableClassName,
          data: [],
          columns: [],
        };
  }, [selectedRole, userRole]);
};
