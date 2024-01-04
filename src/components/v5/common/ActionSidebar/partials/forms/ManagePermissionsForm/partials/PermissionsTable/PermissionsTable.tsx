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

const PermissionsTable: FC<PermissionsTableProps> = ({ name, role }) => {
  const customPermissionsTableColumns = useCustomPermissionsTableColumns(name);
  const permissionsTableProps = usePermissionsTableProps(role);
  const { fieldState } = useController({ name });

  if (!role) {
    return null;
  }

  return (
    <div className="mt-7">
      {role !== USER_ROLE.Custom ? (
        <Table<PermissionsTableModel>
          verticalOnMobile={false}
          {...permissionsTableProps}
        />
      ) : (
        <Table<CustomPermissionTableModel>
          className={clsx({
            '!border-negative-400': !!fieldState.error,
          })}
          data={CUTOM_PERMISSION_TABLE_CONTENT}
          columns={customPermissionsTableColumns}
        />
      )}
    </div>
  );
};

PermissionsTable.displayName = displayName;

export default PermissionsTable;
