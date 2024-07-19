import { ColonyRole, Id } from '@colony/colony-js';
import clsx from 'clsx';
import React from 'react';

import { UserRole } from '~constants/permissions.ts';
import { useMobile } from '~hooks/index.ts';
import { usePermissionsTableProps } from '~hooks/usePermissionsTableProps.tsx';
import {
  type CustomPermissionTableModel,
  type PermissionsTableModel,
} from '~types/permissions.ts';
import { CUSTOM_PERMISSION_TABLE_CONTENT } from '~utils/colonyActions.ts';
import { UserRoleModifier } from '~v5/common/ActionSidebar/partials/forms/ManagePermissionsForm/consts.ts';
import Table from '~v5/common/Table/index.ts';

import { getCustomPermissionsTableColumns } from './utils.tsx';

const displayName = 'v5.common.ActionsContent.partials.PermissionsTable';

interface Props {
  role: UserRole;
  domainId: number | undefined;
  userRolesForDomain: ColonyRole[];
  oldUserRolesForDomain?: ColonyRole[];
}

const PermissionsTable = ({
  role,
  domainId,
  userRolesForDomain,
  oldUserRolesForDomain,
}: Props) => {
  const isMobile = useMobile();
  const customPermissionsTableColumns = getCustomPermissionsTableColumns(
    userRolesForDomain,
    isMobile,
  );

  const activeFormRole = userRolesForDomain?.length
    ? role
    : UserRoleModifier.Remove;

  const permissionsTableProps = usePermissionsTableProps({
    activeFormRole,
    userRolesForDomain,
    userRoleWrapperForDomain: role,
    isCompletedAction: true,
    oldUserRolesForDomain,
  });

  const ALLOWED_CUSTOM_PERMISSION_TABLE_CONTENT =
    CUSTOM_PERMISSION_TABLE_CONTENT.filter(({ key }) =>
      key === ColonyRole.Root || key === ColonyRole.Recovery
        ? domainId === Id.RootDomain
        : true,
    );

  return (
    <div className="mt-7">
      {activeFormRole !== UserRole.Custom ? (
        <Table<PermissionsTableModel> {...permissionsTableProps} />
      ) : (
        <Table<CustomPermissionTableModel>
          className={clsx(
            'sm:[&_td:nth-child(2)>div]:px-0 sm:[&_td>div]:min-h-[2.875rem] sm:[&_td>div]:py-2 sm:[&_th:nth-child(2)]:px-0 sm:[&_tr>td]:border-none',
          )}
          data={ALLOWED_CUSTOM_PERMISSION_TABLE_CONTENT}
          columns={customPermissionsTableColumns}
          verticalLayout={isMobile}
        />
      )}
    </div>
  );
};

PermissionsTable.displayName = displayName;

export default PermissionsTable;
