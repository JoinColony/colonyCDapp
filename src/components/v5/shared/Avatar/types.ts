import { UserStatusMode } from '~v5/common/Pills/types';

export type AvatarSize =
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
  placeholderIcon?: string;
  size?: AvatarSize;
  title?: string | null;
  mode?: UserStatusMode;
  borderClassName?: string;
}

export interface AvatarWithStatusBadgeProps extends AvatarProps {
  badgeText?: string;
  isFilled?: boolean;
}
