import { ColonyRole, Id } from '@colony/colony-js';
import clsx from 'clsx';
import React from 'react';

import { UserRole } from '~constants/permissions.ts';
import { useMobile } from '~hooks/index.ts';
import usePermissionsTableProps from '~hooks/usePermissionsTableProps/index.ts';
import {
  type CustomPermissionTableModel,
  type PermissionsTableModel,
} from '~types/permissions.ts';
import { CUSTOM_PERMISSION_TABLE_CONTENT } from '~utils/colonyActions.ts';
import { UserRoleModifier } from '~v5/common/ActionSidebar/partials/forms/ManagePermissionsForm/consts.ts';
import { Table } from '~v5/common/Table/Table.tsx';

import { getCustomPermissionsTableColumns } from './utils.tsx';

const displayName = 'v5.common.ActionsContent.partials.PermissionsTable';

interface Props {
  dbRoleForDomainNew: UserRole;
  domainId: number | undefined;
  dbPermissionsNew: ColonyRole[];
  dbPermissionsOld?: ColonyRole[];
  dbRoleForDomainOld?: UserRole;
}

const PermissionsTable = ({
  dbRoleForDomainNew,
  domainId,
  dbPermissionsNew,
  dbPermissionsOld,
  dbRoleForDomainOld,
}: Props) => {
  const isMobile = useMobile();
  const customPermissionsTableColumns = getCustomPermissionsTableColumns(
    dbPermissionsNew,
    isMobile,
  );

  const formRole = dbPermissionsNew?.length
    ? dbRoleForDomainNew
    : UserRoleModifier.Remove;

  const permissionsTableProps = usePermissionsTableProps({
    formRole,
    dbRoleForDomain: dbRoleForDomainOld,
    dbPermissionsForDomain: dbPermissionsOld,
    isRemovePermissions: formRole === UserRoleModifier.Remove,
  });

  const ALLOWED_CUSTOM_PERMISSIONS_TABLE_CONTENT =
    CUSTOM_PERMISSION_TABLE_CONTENT.filter(({ key }) =>
      key === ColonyRole.Root || key === ColonyRole.Recovery
        ? domainId === Id.RootDomain
        : true,
    );

  return (
    <div className="mt-7">
      {formRole !== UserRole.Custom ? (
        <Table<PermissionsTableModel> {...permissionsTableProps} />
      ) : (
        <Table<CustomPermissionTableModel>
          className={clsx(
            'sm:[&_td:nth-child(2)>div]:px-0 sm:[&_td>div]:min-h-[2.875rem] sm:[&_td>div]:py-2 sm:[&_th:nth-child(2)]:px-0 sm:[&_tr>td]:border-none',
          )}
          data={ALLOWED_CUSTOM_PERMISSIONS_TABLE_CONTENT}
          columns={customPermissionsTableColumns}
          layout={isMobile ? 'vertical' : 'horizontal'}
        />
      )}
    </div>
  );
};

PermissionsTable.displayName = displayName;

export default PermissionsTable;
