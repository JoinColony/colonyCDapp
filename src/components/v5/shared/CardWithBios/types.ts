import { type Icon } from '@phosphor-icons/react';

import { type ColonyContributor, type User } from '~types/graphql.ts';
import { type PillSize, type UserStatusMode } from '~v5/common/Pills/types.ts';

export type Permissions = {
  key: string;
  text: string;
  icon: Icon;
};

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
  icon: Icon;
};

export type SubNavigationProps = {
  shouldPermissionsCanBeChanged?: boolean;
  user?: User | null;
};
