import { ContributorWithReputation, User } from '~types';
import { UserStatusMode } from '~v5/common/Pills/types';

export type Permissions = {
  key: string;
  text: string;
  type: PermissionType;
};

export type PermissionType =
  | 'clipboard-text'
  | 'scales'
  | 'clock-counter-clockwise'
  | 'bank'
  | 'buildings';

export type CardWithBiosProps = {
  description?: string;
  shouldStatusBeVisible: boolean;
  userStatus?: UserStatusMode;
  permissions?: Permissions[];
  shouldBeMenuVisible: boolean;
  isVerified?: boolean;
  userData?: ContributorWithReputation;
  isContributorsList?: boolean;
};

export type UserStatusComponentProps = {
  userStatus?: UserStatusMode;
};

export type UserStatusTooltipDetailsProps = {
  key: string;
  text: string;
  description: string;
  name: string;
  mode: string;
};

export type CardPermissionsProps = {
  permissions: Permissions[] | Permissions;
};

export type CardPermissionProps = {
  text: string;
  type: PermissionType;
};

export type SubNavigationProps = {
  shouldPermissionsCanBeChanged?: boolean;
  user?: User | null;
};
