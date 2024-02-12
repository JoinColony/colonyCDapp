import { type UserAvatarDetailsProps } from '../UserAvatarDetails/types.ts';
import { type UserPopoverProps } from '../UserPopover/types.ts';

export interface UserAvatarPopoverProps
  extends Omit<UserPopoverProps, 'aboutDescription'>,
    Pick<UserAvatarDetailsProps, 'isContributorsList'> {
  walletAddress: string;
}

export type UserAvatarContentProps = UserAvatarPopoverProps & {
  aboutDescription: string;
};
