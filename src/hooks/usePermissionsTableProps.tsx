import { User, UsersThree } from '@phosphor-icons/react';
import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import {
  UserRole,
  PERMISSIONS_TABLE_CONTENT,
  USER_ROLES,
} from '~constants/permissions.ts';
import { type PermissionsTableModel } from '~types/permissions.ts';
import { tw } from '~utils/css/index.ts';
import { formatText } from '~utils/intl.ts';
import {
  UserRoleModifier,
  type ManagePermissionsFormValues,
} from '~v5/common/ActionSidebar/partials/forms/ManagePermissionsForm/consts.ts';
import PermissionsBadge from '~v5/common/Pills/PermissionsBadge/PermissionsBadge.tsx';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';
import { type TableProps } from '~v5/common/Table/types.ts';

const permissionsColumnHelper = createColumnHelper<PermissionsTableModel>();

export const usePermissionsTableProps = ({
  isCompletedAction,
  activeFormRole,
  userRoleWrapperForDomain,
  userRolesForDomain,
  oldUserRolesForDomain,
}: {
  activeFormRole: ManagePermissionsFormValues['role'];
  userRoleWrapperForDomain: ManagePermissionsFormValues['_dbuserRoleWrapperForDomain'];
  userRolesForDomain: ManagePermissionsFormValues['_dbUserRolesForDomain'];
  oldUserRolesForDomain?: ManagePermissionsFormValues['_dbUserRolesForDomain'];
  isCompletedAction?: boolean;
}): TableProps<PermissionsTableModel> => {
  return useMemo(() => {
    const isRemovePermissionsAction =
      activeFormRole === UserRoleModifier.Remove;

    const tableClassName = tw`[&_th]:h-[2.625rem] [&_th]:py-1`;

    const permissionsSet = isCompletedAction
      ? oldUserRolesForDomain
      : userRolesForDomain;

    return permissionsSet &&
      activeFormRole &&
      activeFormRole !== UserRole.Custom
      ? {
          className: tableClassName,
          data: [
            {
              key: Date.now(),
              permissions: isRemovePermissionsAction
                ? permissionsSet?.map((role) =>
                    formatText({ id: `role.${role}` }),
                  )
                : PERMISSIONS_TABLE_CONTENT[activeFormRole].permissions,
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
                    {userRoleWrapperForDomain && (
                      <PermissionsBadge
                        text={
                          USER_ROLES.find(
                            ({ role: roleField }) =>
                              roleField === userRoleWrapperForDomain,
                          )?.name || formatText({ id: 'role.custom' })
                        }
                        icon={
                          userRoleWrapperForDomain === UserRole.Custom
                            ? UsersThree
                            : User
                        }
                      />
                    )}
                  </div>
                ) : (
                  <span className="text-md font-medium text-gray-900">
                    {PERMISSIONS_TABLE_CONTENT[activeFormRole].heading}
                  </span>
                ),
              cell: ({ row }) => {
                const { permissions } = row.original;

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
                      })}
                    >
                      {permissions.map((permission) => {
                        return (
                          <ul
                            key={JSON.stringify(permission)}
                            className="list-disc pl-6"
                          >
                            <li
                              className="capitalize text-gray-600"
                              key={JSON.stringify(permission)}
                            >
                              <div className="flex items-center justify-between">
                                <div>{permission}</div>
                                {isRemovePermissionsAction && (
                                  <PillsBase className="bg-negative-100 text-negative-400">
                                    {formatText({ id: 'badge.removed' })}
                                  </PillsBase>
                                )}
                              </div>
                            </li>
                          </ul>
                        );
                      })}
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
    activeFormRole,
    isCompletedAction,
    oldUserRolesForDomain,
    userRolesForDomain,
    userRoleWrapperForDomain,
  ]);
};
