import React, { useMemo } from 'react';
import { PopperOptions } from 'react-popper-tooltip';

import Popover from '~shared/Popover';
import Avatar from '~shared/Avatar';
import UserInfoPopover from '../UserInfoPopover';
import Link from '~shared/NavLink';
import { Address, User, Colony } from '~types';

import styles from './UserAvatar.css';
import { getMainClasses } from '~utils/css';

interface Props {
  /** Address of the current user for identicon fallback */
  address: Address;

  /** Avatar image URL (can be a base64 encoded url string) */
  avatarURL?: string;

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
}: Props) => {
  const trigger = showInfo ? 'click' : 'disabled';
  const showArrow = popperOptions && popperOptions.showArrow;

  const renderContent = useMemo(() => {
    return <UserInfoPopover colony={colony} user={user} banned={banned} />;
  }, [user, banned, colony]);

  const avatar = (
    <Popover
      renderContent={renderContent}
      popperOptions={popperOptions}
      trigger={trigger}
      showArrow={showArrow}
    >
      <div
        // @ts-ignore
        className={getMainClasses({}, styles, {
          showOnClick: trigger === 'click',
        })}
      >
        <Avatar
          avatarURL={avatarURL}
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
    // Won't this always be lowercase?
    return <Link to={`/user/${user.name.toLowerCase()}`}>{avatar}</Link>;
  }
  return avatar;
};

UserAvatar.displayName = displayName;

export default UserAvatar;
