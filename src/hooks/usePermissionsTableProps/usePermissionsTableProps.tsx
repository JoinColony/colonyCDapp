import { type ColonyRole } from '@colony/colony-js';
import { User } from '@phosphor-icons/react';
import { createColumnHelper } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { type MessageDescriptor } from 'react-intl';

import {
  UserRole,
  PERMISSIONS_TABLE_CONTENT,
  USER_ROLES,
} from '~constants/permissions.ts';
import { type PermissionsTableModel } from '~types/permissions.ts';
import { tw } from '~utils/css/index.ts';
import { formatText } from '~utils/intl.ts';
import { capitalizeFirstLetter } from '~utils/strings.ts';
import { type ManagePermissionsFormValues } from '~v5/common/ActionSidebar/partials/forms/ManagePermissionsForm/consts.ts';
import { getPermissionName } from '~v5/common/ActionSidebar/partials/forms/ManagePermissionsForm/utils.ts';
import PermissionsBadge from '~v5/common/Pills/PermissionsBadge/PermissionsBadge.tsx';
import { type TableProps } from '~v5/common/Table/types.ts';

import { PermissionsTableCell } from './partials/PermissionsTableCell.tsx';
import { RootPermissionsRemovalTableCell } from './partials/RootPermissionsRemovalTableCell.tsx';

const permissionsColumnHelper = createColumnHelper<PermissionsTableModel>();

type BaseProps = {
  formRole: ManagePermissionsFormValues['role'];
  dbRoleForDomain: ManagePermissionsFormValues['_dbRoleForDomain'];
  dbPermissionsForDomain: ManagePermissionsFormValues['_dbPermissionsForDomain'];
};

type Props = BaseProps &
  (
    | {
        isRemovePermissions?: false;
        isRemovingRoot?: never;
      }
    | {
        isRemovePermissions: true;
        isRemovingRoot?: boolean;
      }
  );

const usePermissionsTableProps = ({
  dbPermissionsForDomain,
  formRole,
  dbRoleForDomain,
  isRemovePermissions,
  isRemovingRoot,
}: Props): TableProps<PermissionsTableModel> => {
  return useMemo(() => {
    const tableClassName = tw`[&_th]:h-[2.625rem] [&_th]:py-1`;

    if (!dbPermissionsForDomain || !formRole) {
      return {
        className: tableClassName,
        data: [],
        columns: [],
      };
    }

    let tableHeaderDescriptorId: MessageDescriptor['id'] = '';
    let tableCellDescriptorId: MessageDescriptor['id'] = '';
    let permissionsData: string[] | ColonyRole[] = [];

    if (isRemovePermissions) {
      if (isRemovingRoot) {
        tableHeaderDescriptorId =
          'actionSidebar.managePermissions.removeRootPermissionsTableHeading';

        permissionsData = dbPermissionsForDomain?.map(getPermissionName);

        tableCellDescriptorId =
          'actionSidebar.managePermissions.removeRootPermissionsTableCellDescription';
      } else if (dbRoleForDomain === UserRole.Custom) {
        tableHeaderDescriptorId =
          'actionSidebar.managePermissions.removeCustomPermissionsTableHeading';

        permissionsData = dbPermissionsForDomain?.map(getPermissionName);

        tableCellDescriptorId =
          'actionSidebar.managePermissions.removeCustomPermissionsTableCellDescription';
      } else {
        tableHeaderDescriptorId =
          'actionSidebar.managePermissions.removeBundlePermissionsTableHeading';

        permissionsData = dbRoleForDomain
          ? PERMISSIONS_TABLE_CONTENT[dbRoleForDomain]?.permissions
          : [];

        tableCellDescriptorId =
          'actionSidebar.managePermissions.removePermissionsTableCellDescription';
      }
    } else {
      tableHeaderDescriptorId =
        'actionSidebar.managePermissions.assignPermissionsTableHeading';

      permissionsData = PERMISSIONS_TABLE_CONTENT[formRole]?.permissions;

      tableCellDescriptorId =
        'actionSidebar.managePermissions.tableDescriptionHeading';
    }

    return {
      className: tableClassName,
      data: [
        {
          key: Date.now(),
          permissions: permissionsData,
        },
      ],
      columns: [
        permissionsColumnHelper.accessor('permissions', {
          enableSorting: false,
          header: () => (
            <div className="flex items-center gap-2">
              <span className="text-md font-medium text-gray-900">
                {formatText(
                  {
                    id: tableHeaderDescriptorId,
                  },
                  {
                    role: capitalizeFirstLetter(
                      (isRemovePermissions ? dbRoleForDomain : formRole) ??
                        UserRole.Custom,
                    ),
                  },
                )}
              </span>
              <PermissionsBadge
                text={
                  USER_ROLES.find(
                    ({ role: roleField }) =>
                      roleField ===
                      (isRemovePermissions ? dbRoleForDomain : formRole),
                  )?.name || formatText({ id: 'role.custom' })
                }
                icon={User}
              />
            </div>
          ),
          cell: ({ row }) => {
            const { permissions = [] } = row.original;

            return (
              <>
                <p className="mb-3 inline-block text-md text-gray-600">
                  {formatText(
                    { id: tableCellDescriptorId },
                    { count: permissions.length },
                  )}
                </p>
                <div className="w-full">
                  {isRemovingRoot ? (
                    <RootPermissionsRemovalTableCell
                      permissions={permissions}
                    />
                  ) : (
                    <PermissionsTableCell permissions={permissions} />
                  )}
                </div>
              </>
            );
          },
        }),
      ],
    };
  }, [
    dbPermissionsForDomain,
    dbRoleForDomain,
    formRole,
    isRemovePermissions,
    isRemovingRoot,
  ]);
};

export default usePermissionsTableProps;
