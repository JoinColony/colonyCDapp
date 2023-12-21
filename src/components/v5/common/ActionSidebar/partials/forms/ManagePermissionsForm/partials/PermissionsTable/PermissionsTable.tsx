import clsx from 'clsx';
import React, { FC } from 'react';
import { useController } from 'react-hook-form';

import { USER_ROLE } from '~constants/permissions';
import Table from '~v5/common/Table';

import { CUTOM_PERMISSION_TABLE_CONTENT } from './consts';
import {
  useCustomPermissionsTableColumns,
  usePermissionsTableProps,
} from './hooks';
import {
  CustomPermissionTableModel,
  PermissionsTableModel,
  PermissionsTableProps,
} from './types';

const displayName = 'v5.common.ActionsContent.partials.PermissionsTable';

const PermissionsTable: FC<PermissionsTableProps> = ({
  name,
  role,
  className,
}) => {
  const customPermissionsTableColumns = useCustomPermissionsTableColumns(name);
  const permissionsTableProps = usePermissionsTableProps(role);
  const { fieldState } = useController({ name });

  if (!role) {
    return null;
  }

  return (
    <div className={className}>
      {role !== USER_ROLE.Custom ? (
        <Table<PermissionsTableModel>
          verticalOnMobile={false}
          {...permissionsTableProps}
        />
      ) : (
        <Table<CustomPermissionTableModel>
          className={clsx(
            'sm:[&_td>div]:py-2 sm:[&_td>div]:min-h-[2.875rem] sm:[&_td:nth-child(2)>div]:px-0 sm:[&_th:nth-child(2)]:px-0 sm:[&_tr>td]:border-none',
            {
              '!border-negative-400': !!fieldState.error,
            },
          )}
          data={CUTOM_PERMISSION_TABLE_CONTENT}
          columns={customPermissionsTableColumns}
        />
      )}
    </div>
  );
};

PermissionsTable.displayName = displayName;

export default PermissionsTable;
