export interface AvatarProps {
  seed?: string;
  avatar?: string | null;
  className?: string;
  notSet?: boolean;
  placeholderIcon?: string;
  size?: AvatarSize;
  title?: string;
}

export type AvatarSize = 'xxs' | 'xs' | 'sm' | 's' | 'm' | 'xm' | 'l' | 'xl';
