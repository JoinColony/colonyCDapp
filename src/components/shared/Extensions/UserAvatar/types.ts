import { User } from '~types';

export interface UserAvatarProps {
  userName: string;
  preferThumbnail?: boolean;
  user?: User | null;
  isLink?: boolean;
  size?: 'xxs' | 'xs';
}
