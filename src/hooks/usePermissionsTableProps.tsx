import { type ColonyRole } from '@colony/colony-js';
import { User, UsersThree } from '@phosphor-icons/react';
import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import chunk from 'lodash/chunk';
import React, { useMemo } from 'react';

import {
  UserRole,
  PERMISSIONS_TABLE_CONTENT,
  USER_ROLES,
} from '~constants/permissions.ts';
import { type PermissionsTableModel } from '~types/permissions.ts';
import { tw } from '~utils/css/index.ts';
import { formatText } from '~utils/intl.ts';
import { type ManagePermissionsFormValues } from '~v5/common/ActionSidebar/partials/forms/ManagePermissionsForm/consts.ts';
import PermissionsBadge from '~v5/common/Pills/PermissionsBadge/PermissionsBadge.tsx';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';
import { type TableProps } from '~v5/common/Table/types.ts';

const permissionsColumnHelper = createColumnHelper<PermissionsTableModel>();

export const usePermissionsTableProps = ({
  roles,
  formRole,
  isCompletedAction,
  dbRoleForDomain,
  isRemovePermissionsAction,
}: {
  formRole: ManagePermissionsFormValues['role'];
  dbRoleForDomain: ManagePermissionsFormValues['_dbRoleForDomain'];
  isCompletedAction?: boolean;
  roles: ColonyRole[] | undefined;
  isRemovePermissionsAction: boolean;
}): TableProps<PermissionsTableModel> => {
  return useMemo(() => {
    const tableClassName = tw`[&_th]:h-[2.625rem] [&_th]:py-1`;

    return roles &&
      formRole &&
      (formRole !== UserRole.Custom || isRemovePermissionsAction)
      ? {
          className: tableClassName,
          data: [
            {
              key: Date.now(),
              permissions: isRemovePermissionsAction
                ? roles?.map((role) => formatText({ id: `role.${role}` }))
                : PERMISSIONS_TABLE_CONTENT[formRole].permissions,
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
                        id: 'actionSidebar.managePermissions.removePermissionsTableHeading',
                      })}
                    </span>
                    {dbRoleForDomain && (
                      <PermissionsBadge
                        text={
                          USER_ROLES.find(
                            ({ role: roleField }) =>
                              roleField === dbRoleForDomain,
                          )?.name || formatText({ id: 'role.custom' })
                        }
                        icon={
                          dbRoleForDomain === UserRole.Custom
                            ? UsersThree
                            : User
                        }
                      />
                    )}
                  </div>
                ) : (
                  <span className="text-md font-medium text-gray-900">
                    {PERMISSIONS_TABLE_CONTENT[formRole].heading}
                  </span>
                ),
              cell: ({ row }) => {
                const { permissions } = row.original;

                const permissionsColumns = chunk(
                  row.original.permissions,
                  Math.ceil(row.original.permissions.length / 2),
                );

                return (
                  <>
                    <span className="mb-3 inline-block text-md text-gray-600">
                      {isRemovePermissionsAction
                        ? formatText(
                            {
                              id: isCompletedAction
                                ? 'actionSidebar.managePermissions.removePermissionsCompletedActionTable'
                                : 'actionSidebar.managePermissions.removePermissionsTableBody',
                            },
                            { count: permissions.length },
                          )
                        : formatText({
                            id: 'actionSidebar.managePermissions.tableDescriptionHeading',
                          })}
                    </span>
                    <div
                      className={clsx('w-full', {
                        'space-y-2': isRemovePermissionsAction,
                        flex: !isRemovePermissionsAction,
                      })}
                    >
                      {isRemovePermissionsAction &&
                        permissions.map((permission) => {
                          return (
                            <ul
                              key={JSON.stringify(permission)}
                              className="list-disc pl-6"
                            >
                              <li
                                className="text-gray-600"
                                key={JSON.stringify(permission)}
                              >
                                <div className="flex items-center justify-between">
                                  {permission}
                                  {isRemovePermissionsAction && (
                                    <PillsBase
                                      isCapitalized={false}
                                      className="bg-negative-100 text-negative-400"
                                    >
                                      {formatText({
                                        id: 'badge.removed',
                                      })}
                                    </PillsBase>
                                  )}
                                </div>
                              </li>
                            </ul>
                          );
                        })}
                      {!isRemovePermissionsAction &&
                        permissionsColumns.map((column) => (
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
          className: tableClassName,
          data: [],
          columns: [],
        };
  }, [
    formRole,
    isCompletedAction,
    isRemovePermissionsAction,
    roles,
    dbRoleForDomain,
  ]);
};
