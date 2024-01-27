import { UserStatusMode } from '~v5/common/Pills/types.ts';

export const badgeTextMapping: Partial<Record<UserStatusMode, string>> = {
  active: 'badge.active',
  'active-new': 'badge.new',
  'active-filled': 'badge.active',
  banned: 'badge.banned',
  dedicated: 'badge.dedicated',
  'dedicated-filled': 'badge.dedicated',
  new: 'badge.new',
  verified: 'badge.verified',
  'top-filled': 'badge.top',
  top: 'badge.top',
};
