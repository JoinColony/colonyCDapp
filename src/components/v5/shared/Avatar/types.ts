import { UserStatusMode } from '~v5/common/Pills/types';

export interface AvatarProps {
  seed?: string;
  avatar?: string | null;
  className?: string;
  notSet?: boolean;
  placeholderIcon?: string;
  size?: AvatarSize;
  title?: string | null;
  mode?: UserStatusMode;
}

export type AvatarSize =
  | 'xxs'
  | 'xs'
  | 'sm'
  | 's'
  | 'm'
  | 'xm'
  | 'md'
  | 'l'
  | 'xl';
