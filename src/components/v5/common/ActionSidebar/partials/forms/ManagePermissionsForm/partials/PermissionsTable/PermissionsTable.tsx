import { ColonyRole, Id } from '@colony/colony-js';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useController, useWatch } from 'react-hook-form';

import { UserRole } from '~constants/permissions.ts';
import { usePermissionsTableProps } from '~hooks/usePermissionsTableProps.tsx';
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
  const customPermissionsTableColumns = useCustomPermissionsTableColumns(name);
  const permissionsTableProps = usePermissionsTableProps(role);
  const { fieldState } = useController({ name });
  const team: string | undefined = useWatch({ name: 'team' });

  if (!role) {
    return null;
  }

  const ALLOWED_CUSTOM_PERMISSION_TABLE_CONTENT =
    CUSTOM_PERMISSION_TABLE_CONTENT.filter(({ key }) =>
      key === ColonyRole.Root || key === ColonyRole.Recovery
        ? Number(team) === Id.RootDomain
        : true,
    );

  return (
    <div className={className}>
      {role !== UserRole.Custom ? (
        <Table<PermissionsTableModel>
          verticalOnMobile={false}
          {...permissionsTableProps}
        />
      ) : (
        <Table<CustomPermissionTableModel>
          className={clsx(
            'sm:[&_td:nth-child(2)>div]:px-0 sm:[&_td>div]:min-h-[2.875rem] sm:[&_td>div]:py-2 sm:[&_th:nth-child(2)]:px-0 sm:[&_tr>td]:border-none',
            {
              '!border-negative-400': !!fieldState.error,
            },
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
