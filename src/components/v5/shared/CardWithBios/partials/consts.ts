import {
  CrownSimple,
  HandHeart,
  Medal,
  ShootingStar,
} from '@phosphor-icons/react';

import {
  type ExtensionStatusBadgeMode,
  type UserStatusMode,
} from '~v5/common/Pills/types.ts';

export const TOP_CONTRIBUTOR_PERCENT = 20;
export const DEDICATED_CONTRIBUTOR_PERCENT = 40;
export const ACTIVE_CONTRIBUTOR_PERCENT = 60;

export const getIcon = (
  userStatus?: ExtensionStatusBadgeMode | UserStatusMode,
) => {
  if (userStatus === 'dedicated' || userStatus === 'dedicated-filled') {
    return Medal;
  }
  if (userStatus === 'top' || userStatus === 'top-filled') {
    return CrownSimple;
  }
  if (userStatus === 'new' || userStatus === 'active-new') {
    return HandHeart;
  }
  if (userStatus === 'active' || userStatus === 'active-filled') {
    return ShootingStar;
  }
  return undefined;
};
