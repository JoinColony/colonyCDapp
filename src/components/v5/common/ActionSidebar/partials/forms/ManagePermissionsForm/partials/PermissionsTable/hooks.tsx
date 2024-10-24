import { Id } from '@colony/colony-js';
import { createColumnHelper } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { useMobile } from '~hooks';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import { type CustomPermissionTableModel } from '~types/permissions.ts';
import { formatText } from '~utils/intl.ts';
import { type ManagePermissionsFormValues } from '~v5/common/ActionSidebar/partials/forms/ManagePermissionsForm/consts.ts';
import { getPermissionName } from '~v5/common/ActionSidebar/partials/forms/ManagePermissionsForm/utils.ts';
import { FormSwitch } from '~v5/common/Fields/Switch/index.ts';

import { CUSTOM_PERMISSIONS_TABLE_MSG } from './consts.ts';

const customPermissionsColumnHelper =
  createColumnHelper<CustomPermissionTableModel>();

export const useCustomPermissionsTableColumns = ({
  name,
  team,
  dbInheritedPermissions = [],
  isCompletedAction = false,
}: {
  name: string;
  team: ManagePermissionsFormValues['team'];
  dbInheritedPermissions: ManagePermissionsFormValues['_dbInheritedPermissions'];
  isCompletedAction?: boolean;
}) => {
  const isMobile = useMobile();

  return useMemo(
    () => [
      customPermissionsColumnHelper.accessor('type', {
        staticSize: isMobile ? '6.125rem' : '8.25rem',
        enableSorting: false,
        header: formatText({ id: 'table.column.type' }),
        cell: ({
          getValue,
          row: {
            original: { tooltipContent },
          },
        }) => {
          const content = (
            <span className="text-md font-medium text-gray-900">
              {getValue()}
            </span>
          );

          return tooltipContent ? (
            <Tooltip
              tooltipContent={tooltipContent}
              className="!inline-flex"
              offset={isMobile ? [-10, 12] : undefined}
              placement={isMobile ? 'bottom-start' : 'right'}
            >
              {content}
            </Tooltip>
          ) : (
            content
          );
        },
      }),
      customPermissionsColumnHelper.accessor('overview', {
        enableSorting: false,
        header: formatText({ id: 'table.column.overview' }),
        cell: ({ getValue }) => (
          <span className="text-md text-gray-600">{getValue()}</span>
        ),
      }),
      customPermissionsColumnHelper.display({
        staticSize: '4.375rem',
        id: 'enabled',
        header: formatText({ id: 'table.column.enable' }),
        cell: ({ row }) => {
          const inheritedPermissionNames =
            dbInheritedPermissions.map(getPermissionName);

          const disabled =
            team !== Id.RootDomain &&
            !isCompletedAction &&
            inheritedPermissionNames?.includes(row.original.type as string);

          const content = (
            <FormSwitch
              disabled={disabled}
              name={`${name}.role_${row.original.name}`}
            />
          );

          return disabled ? (
            <Tooltip
              tooltipContent={formatText(
                CUSTOM_PERMISSIONS_TABLE_MSG.permissionInherited,
              )}
              offset={isMobile ? [-10, 12] : undefined}
              placement={isMobile ? 'bottom-start' : 'right'}
              contentWrapperClassName="max-w-fit"
            >
              {content}
            </Tooltip>
          ) : (
            content
          );
        },
      }),
    ],
    [dbInheritedPermissions, isCompletedAction, isMobile, name, team],
  );
};
