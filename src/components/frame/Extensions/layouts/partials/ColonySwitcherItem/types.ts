import { ColonyAvatarProps } from '~v5/shared/ColonyAvatar/types';
import { LinkProps } from '~v5/shared/Link/types';

export interface ColonySwitcherItemProps
  extends Omit<LinkProps, 'text' | 'textValues'> {
  name: string;
  avatarProps?: Omit<ColonyAvatarProps, 'size'>;
}
