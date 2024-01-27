import {
  ExtensionStatusBadgeMode,
  UserStatusMode,
} from '~v5/common/Pills/types.ts';

export const TOP_CONTRIBUTOR_PERCENT = 20;
export const DEDICATED_CONTRIBUTOR_PERCENT = 40;
export const ACTIVE_CONTRIBUTOR_PERCENT = 60;

export const getIconName = (
  userStatus?: ExtensionStatusBadgeMode | UserStatusMode,
) =>
  ((userStatus === 'dedicated' || userStatus === 'dedicated-filled') &&
    'medal-bold') ||
  ((userStatus === 'top' || userStatus === 'top-filled') && 'crown-simple') ||
  ((userStatus === 'new' || userStatus === 'active-new') && 'hand-heart') ||
  ((userStatus === 'active' || userStatus === 'active-filled') &&
    'shooting-star-bold') ||
  '';
