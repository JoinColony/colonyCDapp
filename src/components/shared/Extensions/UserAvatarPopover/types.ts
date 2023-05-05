import { PopperOptions } from 'react-popper-tooltip';

import { UserAvatarProps } from '~shared/Extensions/UserAvatar/types';

export interface UserAvatarPopoverProps extends Omit<UserAvatarProps, 'isLink'> {
  popperOptions?: PopperOptions;
}
