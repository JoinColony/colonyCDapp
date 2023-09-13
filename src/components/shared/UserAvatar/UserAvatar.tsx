import React from 'react';
import { PopperOptions } from 'react-popper-tooltip';

import Popover from '~shared/Popover';
import Avatar, { AvatarProps } from '~shared/Avatar';
import Link from '~shared/NavLink';
import UserInfoPopover from '~shared/UserInfoPopover';
import { MemberUser, User } from '~types';

import { getMainClasses } from '~utils/css';

import styles from './UserAvatar.css';

export interface UserAvatarProps
  extends Pick<AvatarProps, 'size' | 'className' | 'notSet'> {
  /** Banned comment status */
  banned?: boolean;
  /** Passed on to the `Popper` component */
  popperOptions?: PopperOptions & { showArrow?: boolean };
  /** Whether to show or not show the InfoPopover tooltip over the avatar */
  showInfo?: boolean;
  /** If true the UserAvatar links to the user's profile */
  showLink?: boolean;
  /** The corresponding user object if available */
  user?: User | MemberUser | null;
  /** The address on the member object */
  address?: string;
  /** Use the user's thumbnail instead of full-size avatar */
  preferThumbnail?: boolean;
}

const displayName = 'UserAvatar';

const UserAvatar = ({
  banned = false,
  popperOptions,
  showInfo,
  showLink,
  user,
  address,
  preferThumbnail = true,
  ...avatarProps
}: UserAvatarProps) => {
  const trigger = showInfo ? 'click' : 'disabled';
  const showArrow = popperOptions && popperOptions.showArrow;
  const { walletAddress } = user || {};
  const { profile } = user || {};
  const imageString = preferThumbnail ? profile?.thumbnail : profile?.avatar;

  const avatar = (
    <Popover
      renderContent={
        <UserInfoPopover user={user} banned={banned} address={address} />
      }
      popperOptions={popperOptions}
      trigger={trigger}
      showArrow={showArrow}
    >
      <div
        className={getMainClasses(
          {},
          styles as unknown as { [k: string]: string },
          {
            showOnClick: trigger === 'click',
          },
        )}
      >
        <Avatar
          avatar={imageString}
          placeholderIcon="circle-person"
          seed={walletAddress && walletAddress.toLowerCase()}
          title={
            showInfo
              ? ''
              : profile?.displayName || walletAddress || address || ''
          }
          {...avatarProps}
        />
      </div>
    </Popover>
  );

  if (showLink && user) {
    return (
      <Link to={`/user/${user.profile?.displayName?.toLowerCase()}`}>
        {avatar}
      </Link>
    );
  }

  return avatar;
};

UserAvatar.displayName = displayName;

export default UserAvatar;
