import { ColonyRole, Id } from '@colony/colony-js';
import clsx from 'clsx';
import React from 'react';

import { USER_ROLE, type UserRole } from '~constants/permissions.ts';
import { CUSTOM_PERMISSION_TABLE_CONTENT } from '~v5/common/ActionSidebar/partials/forms/ManagePermissionsForm/partials/PermissionsTable/consts.tsx';
import { usePermissionsTableProps } from '~v5/common/ActionSidebar/partials/forms/ManagePermissionsForm/partials/PermissionsTable/hooks.tsx';
import {
  type CustomPermissionTableModel,
  type PermissionsTableModel,
} from '~v5/common/ActionSidebar/partials/forms/ManagePermissionsForm/partials/PermissionsTable/types.ts';
import Table from '~v5/common/Table/index.ts';

import { getCustomPermissionsTableColumns } from './hooks.tsx';

const displayName = 'v5.common.ActionsContent.partials.PermissionsTable';

interface Props {
  role: UserRole;
  domainId: number | undefined;
  userColonyRoles: ColonyRole[];
}

const PermissionsTable = ({ role, domainId, userColonyRoles }: Props) => {
  const customPermissionsTableColumns =
    getCustomPermissionsTableColumns(userColonyRoles);
  const permissionsTableProps = usePermissionsTableProps(role);

  if (!role) {
    return null;
  }

  const ALLOWED_CUSTOM_PERMISSION_TABLE_CONTENT =
    CUSTOM_PERMISSION_TABLE_CONTENT.filter(({ key }) =>
      key === ColonyRole.Root || key === ColonyRole.Recovery
        ? domainId === Id.RootDomain
        : true,
    );

  return (
    <div className="mt-7">
      {role !== USER_ROLE.Custom ? (
        <Table<PermissionsTableModel>
          verticalOnMobile={false}
          {...permissionsTableProps}
        />
      ) : (
        <Table<CustomPermissionTableModel>
          className={clsx(
            'sm:[&_td>div]:py-2 sm:[&_td>div]:min-h-[2.875rem] sm:[&_td:nth-child(2)>div]:px-0 sm:[&_th:nth-child(2)]:px-0 sm:[&_tr>td]:border-none',
          )}
          data={ALLOWED_CUSTOM_PERMISSION_TABLE_CONTENT}
          columns={customPermissionsTableColumns}
        />
      )}
    </div>
  );
};

PermissionsTable.displayName = displayName;

export default PermissionsTable;
