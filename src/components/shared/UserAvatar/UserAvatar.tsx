import React from 'react';
import { PopperOptions } from 'react-popper-tooltip';

import Popover from '~shared/Popover';
import Avatar from '~shared/Avatar';
import Link from '~shared/NavLink';
import UserInfoPopover from '~shared/UserInfoPopover';
import { Address, User, Colony } from '~types';

import { getMainClasses } from '~utils/css';
import styles from './UserAvatar.css';

interface Props {
  /** Address of the current user for identicon fallback */
  address: Address;

  /** Avatar image URL (can be a base64 encoded url string) */
  avatarString?: string;

  /** Banned comment status */
  banned?: boolean;

  /** Is passed through to Avatar */
  className?: string;

  colony?: Colony;

  /** Avatars that are not set have a different placeholder */
  notSet?: boolean;

  /** Passed on to the `Popper` component */
  popperOptions?: PopperOptions & { showArrow?: boolean };

  /** Whether to show or not show the InfoPopover tooltip over the avatar */
  showInfo?: boolean;

  /** If true the UserAvatar links to the user's profile */
  showLink?: boolean;

  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';

  /** The corresponding user object if available */
  user?: User;

  preferThumbnail?: boolean;
}

const displayName = 'UserAvatar';

const UserAvatar = ({
  address,
  avatarURL,
  banned = false,
  className,
  colony,
  notSet,
  popperOptions,
  showInfo,
  showLink,
  size,
  user,
  preferThumbnail = true,
}: Props) => {
  const trigger = showInfo ? 'click' : 'disabled';
  const showArrow = popperOptions && popperOptions.showArrow;
  const { profile } = user || {};
  const imageString = preferThumbnail ? profile?.thumbnail : profile?.avatar;

  const renderContent = () => {
    return <UserInfoPopover colony={colony} user={user} banned={banned} />;
  };

  const avatar = (
    <Popover
      renderContent={renderContent}
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
          avatarURL={avatarURL || imageString || undefined}
          className={className}
          notSet={typeof notSet === 'undefined' ? true : notSet}
          placeholderIcon="circle-person"
          seed={address && address.toLowerCase()}
          size={size}
          title={
            showInfo ? '' : user?.profile?.displayName || user?.name || address
          }
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
