import React from 'react';

import { Address } from '~types';
import { Colony } from '~types';

import Avatar from '~shared/Avatar';
import NavLink from '~shared/NavLink';

export interface Props {
  /** Address of the colony for identicon fallback */
  colonyAddress: Address;

  /** Avatar image URL (can be a base64 encoded url string) */
  avatarURL?: string;

  /** Is passed through to Avatar */
  className?: string;

  /** Avatars that are not set have a different placeholder */
  notSet?: boolean;

  /** If true the UserAvatar links to the user's profile */
  showLink?: boolean;

  /** Avatar size (default is between `s` and `m`) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';

  /** The corresponding user object if available */
  colony?: Colony;

  prefferThumbnail?: boolean;
}

const displayName = 'ColonyAvatar';

const ColonyAvatar = ({
  colonyAddress,
  avatarURL,
  className,
  colony: {
    // @ts-ignore
    name,
    // @ts-ignore
    profile: { displayName: colonyDisplayName, avatar, thumbnail },
  },
  notSet,
  size,
  showLink,
  prefferThumbnail = true,
}: Props) => {
  const imageString = prefferThumbnail ? thumbnail : avatar;
  const colonyAvatar = (
    <Avatar
      avatarURL={avatarURL || imageString}
      className={className}
      notSet={notSet}
      placeholderIcon="at-sign-circle"
      seed={colonyAddress && colonyAddress.toLowerCase()}
      size={size}
      title={colonyDisplayName || name || colonyAddress}
    />
  );
  if (showLink && name) {
    return <NavLink to={`/colony/${name}`}>{colonyAvatar}</NavLink>;
  }
  return colonyAvatar;
};

ColonyAvatar.displayName = displayName;

export default ColonyAvatar;
