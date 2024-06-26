import { type ColonyRole } from '@colony/colony-js';

import { type UserRole } from '~constants/permissions.ts';

export interface PermissionsTableProps {
  name: string;
  role?: UserRole;
  className?: string;
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
