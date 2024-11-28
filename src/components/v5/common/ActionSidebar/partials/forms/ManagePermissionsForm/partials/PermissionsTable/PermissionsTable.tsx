import { ColonyRole, Id } from '@colony/colony-js';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { UserRole } from '~constants/permissions.ts';
import { useMobile } from '~hooks/index.ts';
import usePermissionsTableProps from '~hooks/usePermissionsTableProps/index.ts';
import {
  type PermissionsTableModel,
  type CustomPermissionTableModel,
  type PermissionsTableProps,
} from '~types/permissions.ts';
import { CUSTOM_PERMISSION_TABLE_CONTENT } from '~utils/colonyActions.ts';
import {
  UserRoleModifier,
  type ManagePermissionsFormValues,
} from '~v5/common/ActionSidebar/partials/forms/ManagePermissionsForm/consts.ts';
import Table from '~v5/common/Table/index.ts';

import { useCustomPermissionsTableColumns } from './hooks.tsx';

const displayName = 'v5.common.ActionsContent.partials.PermissionsTable';

const PermissionsTable: FC<PermissionsTableProps> = ({
  name,
  className,
  dbRoleForDomain,
  dbPermissionsForDomain,
  formRole,
  dbInheritedPermissions,
}) => {
  const team = useWatch<ManagePermissionsFormValues, 'team'>({ name: 'team' });

  const isMobile = useMobile();
  const customPermissionsTableColumns = useCustomPermissionsTableColumns({
    name,
    team,
    dbInheritedPermissions,
  });

  const permissionsTableProps = usePermissionsTableProps({
    dbRoleForDomain,
    formRole,
    dbPermissionsForDomain,
    isRemovePermissions: formRole === UserRoleModifier.Remove,
  });
  const { formState } = useFormContext<ManagePermissionsFormValues>();

  const ALLOWED_CUSTOM_PERMISSION_TABLE_CONTENT =
    CUSTOM_PERMISSION_TABLE_CONTENT.filter(({ key }) =>
      key === ColonyRole.Root || key === ColonyRole.Recovery
        ? Number(team) === Id.RootDomain
        : true,
    );

  return (
    <div className={className}>
      {formRole === UserRole.Custom ? (
        <Table<CustomPermissionTableModel>
          className={clsx(
            'sm:[&_td:nth-child(2)>div]:px-0 sm:[&_td>div]:min-h-[2.875rem] sm:[&_td>div]:py-2 sm:[&_th:nth-child(2)]:px-0',
            {
              '!border-negative-300': !!formState.errors.permissions,
            },
          )}
          data={ALLOWED_CUSTOM_PERMISSION_TABLE_CONTENT}
          columns={customPermissionsTableColumns}
          verticalLayout={isMobile}
          withBorder={false}
          tableBodyRowKeyProp="type"
        />
      ) : (
        <Table<PermissionsTableModel>
          {...permissionsTableProps}
          className={clsx({
            '!border-negative-300': !!formState.errors.role,
          })}
        />
      )}
    </div>
  );
};

PermissionsTable.displayName = displayName;

export default PermissionsTable;
