import { type ColonyRole } from '@colony/colony-js';

import { type ManagePermissionsFormValues } from '~v5/common/ActionSidebar/partials/forms/ManagePermissionsForm/consts.ts';

export interface PermissionsTableProps {
  name: string;
  className?: string;
  userRoleWrapperForDomain: ManagePermissionsFormValues['_dbuserRoleWrapperForDomain'];
  userRolesForDomain: ManagePermissionsFormValues['_dbUserRolesForDomain'];
  activeFormRole: ManagePermissionsFormValues['role'];
}

export interface PermissionsTableModel {
  key: React.Key;
  permissions: React.ReactNode[];
}

export interface CustomPermissionTableModel {
  key: React.Key;
  type: React.ReactNode;
  overview: React.ReactNode;
  name: ColonyRole;
  tooltipContent?: string;
}
