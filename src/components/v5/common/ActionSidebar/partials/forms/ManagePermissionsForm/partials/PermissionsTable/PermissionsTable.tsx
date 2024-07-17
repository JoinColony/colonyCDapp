import { ColonyRole, Id } from '@colony/colony-js';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { UserRole } from '~constants/permissions.ts';
import { useMobile } from '~hooks/index.ts';
import { usePermissionsTableProps } from '~hooks/usePermissionsTableProps.tsx';
import {
  type PermissionsTableModel,
  type CustomPermissionTableModel,
  type PermissionsTableProps,
} from '~types/permissions.ts';
import { CUSTOM_PERMISSION_TABLE_CONTENT } from '~utils/colonyActions.ts';
import Table from '~v5/common/Table/index.ts';

import { type ManagePermissionsFormValues } from '../../consts.ts';

import { useCustomPermissionsTableColumns } from './hooks.tsx';

const displayName = 'v5.common.ActionsContent.partials.PermissionsTable';

const PermissionsTable: FC<PermissionsTableProps> = ({
  name,
  role,
  className,
}) => {
  const isMobile = useMobile();
  const customPermissionsTableColumns = useCustomPermissionsTableColumns(name);
  const permissionsTableProps = usePermissionsTableProps(role);
  const { formState } = useFormContext<ManagePermissionsFormValues>();
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
          {...permissionsTableProps}
          tableClassName={clsx({
            '!border-negative-300': !!formState.errors.role,
          })}
        />
      ) : (
        <Table<CustomPermissionTableModel>
          className="sm:[&_td:nth-child(2)>div]:px-0 sm:[&_td>div]:min-h-[2.875rem] sm:[&_td>div]:py-2 sm:[&_th:nth-child(2)]:px-0"
          data={ALLOWED_CUSTOM_PERMISSION_TABLE_CONTENT}
          columns={customPermissionsTableColumns}
          verticalLayout={isMobile}
          withBorder={false}
          tableClassName={clsx({
            '!border-negative-300': !!formState.errors.permissions,
          })}
          tableBodyRowKeyProp="type"
        />
      )}
    </div>
  );
};

PermissionsTable.displayName = displayName;

export default PermissionsTable;
