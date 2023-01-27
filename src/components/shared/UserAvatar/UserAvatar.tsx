import React from 'react';
import { PopperOptions } from 'react-popper-tooltip';

import Popover from '~shared/Popover';
import Avatar, { AvatarProps } from '~shared/Avatar';
import Link from '~shared/NavLink';
import UserInfoPopover from '~shared/UserInfoPopover';
import { Address, User, Colony } from '~types';

import { getMainClasses } from '~utils/css';
import styles from './UserAvatar.css';

interface Props extends Pick<AvatarProps, 'size' | 'className' | 'notSet'> {
  /** Address of the current user for identicon fallback */
  address: Address;
  /** Banned comment status */
  banned?: boolean;
  /** Colony object */
  colony?: Colony;
  /** Passed on to the `Popper` component */
  popperOptions?: PopperOptions & { showArrow?: boolean };
  /** Whether to show or not show the InfoPopover tooltip over the avatar */
  showInfo?: boolean;
  /** If true the UserAvatar links to the user's profile */
  showLink?: boolean;
  /** The corresponding user object if available */
  user?: User | null;
  /** Use the user's thumbnail instead of their full avatar */
  preferThumbnail?: boolean;
}

const displayName = 'UserAvatar';

const UserAvatar = ({
  address,
  banned = false,
  colony,
  popperOptions,
  showInfo,
  showLink,
  user,
  preferThumbnail = true,
  ...avatarProps
}: Props) => {
  const trigger = showInfo ? 'click' : 'disabled';
  const showArrow = popperOptions && popperOptions.showArrow;
  const { profile } = user || {};
  const imageString = preferThumbnail ? profile?.thumbnail : profile?.avatar;

  const avatar = (
    <Popover
      renderContent={
        <UserInfoPopover colony={colony} user={user} banned={banned} />
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
          seed={address && address.toLowerCase()}
          title={
            showInfo ? '' : user?.profile?.displayName || user?.name || address
          }
          {...avatarProps}
        />
      </div>
    </Popover>
  );
  if (showLink && user) {
    return <Link to={`/user/${user.name.toLowerCase()}`}>{avatar}</Link>;
  }
  return avatar;
};

UserAvatar.displayName = displayName;

export default UserAvatar;
