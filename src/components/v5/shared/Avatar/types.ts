import { type Icon } from '@phosphor-icons/react';

import { type UserStatusMode } from '~v5/common/Pills/types.ts';

export type AvatarSize =
  | 'xxxs'
  | 'xxs'
  | 'xss'
  | 'xs'
  | 'xxsm'
  | 'sm'
  | 'xsm'
  | 'smx'
  | 's'
  | 'ms'
  | 'xms'
  | 'm'
  | 'xm'
  | 'md'
  | 'l'
  | 'xl';

export interface AvatarProps {
  seed?: string;
  avatar?: string | null;
  className?: string;
  notSet?: boolean;
  placeholderIcon?: Icon;
  size?: AvatarSize;
  title?: string | null;
  mode?: UserStatusMode;
  borderClassName?: string;
}

export interface AvatarWithStatusBadgeProps extends AvatarProps {
  badgeText?: string;
  isFilled?: boolean;
}

export interface AvatarProps2 {
  className?: string;
  src?: string;
  alt: string;
  address: string;
  size: number;
}
