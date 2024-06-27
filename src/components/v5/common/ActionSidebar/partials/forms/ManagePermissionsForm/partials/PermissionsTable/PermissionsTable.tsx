import { ColonyRole, Id } from '@colony/colony-js';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useController, useWatch } from 'react-hook-form';

import { UserRole, getRole } from '~constants/permissions.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks/index.ts';
import { usePermissionsTableProps } from '~hooks/usePermissionsTableProps.tsx';
import { getUserRolesForDomain } from '~transformers';
import {
  type PermissionsTableModel,
  type CustomPermissionTableModel,
  type PermissionsTableProps,
} from '~types/permissions.ts';
import { CUSTOM_PERMISSION_TABLE_CONTENT } from '~utils/colonyActions.ts';
import Table from '~v5/common/Table/index.ts';

import { useCustomPermissionsTableColumns } from './hooks.tsx';

const displayName = 'v5.common.ActionsContent.partials.PermissionsTable';

const PermissionsTable: FC<PermissionsTableProps> = ({
  name,
  role,
  className,
}) => {
  const { colony } = useColonyContext();
  const isMobile = useMobile();
  const { fieldState } = useController({ name });
  const team: number | undefined = useWatch({ name: 'team' });
  const member: string | undefined = useWatch({ name: 'member' });
  const customPermissionsTableColumns = useCustomPermissionsTableColumns(name);

  const userPermissions =
    member && team
      ? getUserRolesForDomain({
          colony,
          userAddress: member,
          domainId: team,
          excludeInherited: true,
        })
      : [];

  const userRole = getRole(userPermissions);

  const permissionsTableProps = usePermissionsTableProps(role, userRole);

  if (!role || !userPermissions.length) {
    return null;
  }

  const ALLOWED_CUSTOM_PERMISSION_TABLE_CONTENT =
    CUSTOM_PERMISSION_TABLE_CONTENT.filter(({ key }) =>
      key === ColonyRole.Root || key === ColonyRole.Recovery
        ? team === Id.RootDomain
        : true,
    );

  return (
    <div className={className}>
      {role !== UserRole.Custom ? (
        <Table<PermissionsTableModel> {...permissionsTableProps} />
      ) : (
        <Table<CustomPermissionTableModel>
          className={clsx(
            permissionsTableProps.className,
            'sm:[&_td:nth-child(2)>div]:px-0 sm:[&_td>div]:min-h-[2.875rem] sm:[&_td>div]:py-2 sm:[&_th:nth-child(2)]:px-0',
            {
              '!border-negative-400': !!fieldState.error,
            },
          )}
          data={ALLOWED_CUSTOM_PERMISSION_TABLE_CONTENT}
          columns={customPermissionsTableColumns}
          verticalLayout={isMobile}
          withBorder={false}
        />
      )}
    </div>
  );
};

PermissionsTable.displayName = displayName;

export default PermissionsTable;
