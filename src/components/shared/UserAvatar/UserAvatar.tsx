import React from 'react';
import { PopperOptions } from 'react-popper-tooltip';

import Avatar from '~shared/Avatar';
import InfoPopover, { Props as InfoPopoverProps } from '~shared/InfoPopover';
import Link from '~shared/NavLink';
import { Address, Colony, User } from '~types';
import { getMainClasses } from '~utils/css';

import styles from './UserAvatar.css';

interface BaseProps {
  /** Address of the current user for identicon fallback */
  address: Address;

  /** Avatar image URL (can be a base64 encoded url string) */
  avatarURL?: string;

  /** Is passed through to Avatar */
  className?: string;

  /** Avatars that are not set have a different placeholder */
  notSet?: boolean;

  /** Passed on to the `Popper` component */
  popperOptions?: PopperOptions & { showArrow?: boolean };

  /** If true the UserAvatar links to the user's profile */
  showLink?: boolean;

  /** Whether to show or not show the InfoPopover tooltip over the avatar */
  showInfo?: boolean;

  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';

  /** The corresponding user object if available */
  user?: User;

  /** Banned comment status */
  banned?: boolean;
}

/** Used for the infopopover */
interface PropsForReputation extends BaseProps {
  colony?: Colony;
}

export type Props = BaseProps | PropsForReputation;

const displayName = 'UserAvatar';

const UserAvatar = ({
  address,
  avatarURL,
  className,
  showInfo,
  showLink,
  notSet,
  popperOptions,
  size,
  banned = false,
  user,
  ...rest
}: Props) => {
  let popoverProps: InfoPopoverProps = {
    popperOptions,
    trigger: showInfo ? 'click' : 'disabled',
    user,
    showArrow: !!popperOptions?.showArrow,
  };
  if ('colony' in rest) {
    const { colony } = rest;
    popoverProps = {
      ...popoverProps,
      banned,
      colony,
    };
  }
  const avatar = (
    <InfoPopover {...popoverProps}>
      <div
        className={getMainClasses(
          {},
          styles as unknown as { [k: string]: string },
          {
            showOnClick: popoverProps.trigger === 'click',
          },
        )}
      >
        <Avatar
          avatarURL={avatarURL}
          className={className}
          notSet={notSet ?? true}
          placeholderIcon="circle-person"
          seed={address && address.toLowerCase()}
          size={size}
          title={showInfo ? '' : user?.name || address}
        />
      </div>
    </InfoPopover>
  );
  if (showLink && user?.name) {
    // Won't this always be lowercase?
    return <Link to={`/user/${user.name.toLowerCase()}`}>{avatar}</Link>;
  }
  return avatar;
};

UserAvatar.displayName = displayName;

export default UserAvatar;
