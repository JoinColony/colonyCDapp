import { ColonyContributor, User } from '~types/graphql.ts';
import { PillSize, UserStatusMode } from '~v5/common/Pills/types.ts';

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
  shouldBeMenuVisible: boolean;
  userData: ColonyContributor;
  isContributorsList?: boolean;
};

export type UserStatusComponentProps = {
  userStatus?: UserStatusMode;
  pillSize?: PillSize;
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
