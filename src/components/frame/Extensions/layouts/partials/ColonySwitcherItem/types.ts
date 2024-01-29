import { type ColonyAvatarProps } from '~v5/shared/ColonyAvatar/types.ts';
import { type LinkProps } from '~v5/shared/Link/types.ts';

export interface ColonySwitcherItemProps
  extends Omit<LinkProps, 'text' | 'textValues'> {
  name: string;
  avatarProps?: Omit<ColonyAvatarProps, 'size'>;
}
