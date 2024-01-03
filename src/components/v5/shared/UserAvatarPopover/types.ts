import { AvatarProps } from '~shared/Avatar';

import { UserAvatarDetailsProps } from '../UserAvatarDetails/types';
import { UserPopoverProps } from '../UserPopover/types';

export interface UserAvatarPopoverProps
  extends Omit<UserPopoverProps, 'aboutDescription'>,
    Pick<AvatarProps, 'size'>,
    Pick<UserAvatarDetailsProps, 'isContributorsList'> {
  walletAddress: string;
}

export type UserAvatarContentProps = UserAvatarPopoverProps & {
  aboutDescription: string;
};
