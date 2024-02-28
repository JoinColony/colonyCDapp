import { type ColonyRole } from '@colony/colony-js';
import { type Icon } from '@phosphor-icons/react';

import { type UserRole } from '~constants/permissions.ts';
import { type MemberCardListItem } from '~v5/common/MemberCardList/types.ts';

export type GroupedByPermissionMembersProps = {
  [key in UserRole]: MemberCardListItem[];
};

export interface PermissionPageRowItem extends MemberCardListItem {
  isExtension?: boolean;
}

export interface PermissionPageRowProps {
  title: string;
  description: string;
  members: PermissionPageRowItem[];
  isLoading?: boolean;
  isMultiSig?: boolean;
}

export type PermissionsPageFilters = {
  [key in UserRole]: boolean;
};

export type RolePermissionFilters = {
  [key in ColonyRole]: boolean;
};

export interface NestedItem {
  label: React.ReactNode;
  value: UserRole;
  items?: {
    label: React.ReactNode;
    value: ColonyRole;
  }[];
}

export interface RootItem {
  name: string;
  label: React.ReactNode;
  items: NestedItem[];
  icon: Icon;
  title: React.ReactNode;
}

export interface PermissionsPageFilterProps {
  items: RootItem[];
  onChange: (value: PermissionsPageFilters | RolePermissionFilters) => void;
  searchValue: string;
  onSearch: (value: string) => void;
  filterValue: PermissionsPageFilters | RolePermissionFilters;
  activeFiltersNumber?: number;
}

export interface PermissionsPageFilterRootProps extends RootItem {
  onChange: (value: PermissionsPageFilters | RolePermissionFilters) => void;
  filterValue: PermissionsPageFilters | RolePermissionFilters;
}
