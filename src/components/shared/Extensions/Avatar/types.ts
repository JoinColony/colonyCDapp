export interface AvatarProps {
  seed?: string;
  avatar?: string | null;
  className?: string;
  notSet?: boolean;
  placeholderIcon?: string;
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';
  title: string;
}
