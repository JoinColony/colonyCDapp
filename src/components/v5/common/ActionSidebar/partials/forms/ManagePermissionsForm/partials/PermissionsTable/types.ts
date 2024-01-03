import { ColonyRole } from '@colony/colony-js';
import React from 'react';

import { UserRole } from '~constants/permissions';

export interface PermissionsTableProps {
  name: string;
  role?: UserRole;
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
}
