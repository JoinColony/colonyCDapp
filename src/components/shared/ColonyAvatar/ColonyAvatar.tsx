import React from 'react';

import { Address, Colony, WatchedColony } from '~types';
import Avatar, { AvatarProps } from '~shared/Avatar';
import NavLink from '~shared/Extensions/NavLink';

export interface Props extends Pick<AvatarProps, 'className' | 'notSet' | 'size'> {
  /** Address of the colony for identicon fallback */
  colonyAddress: Address;

  /** If true the UserAvatar links to the user's profile */
  showLink?: boolean;

  /** The colony this avatar is for */
  colony?: WatchedColony | Colony;

  /** Use the thumbnail instead of the avatar image */
  preferThumbnail?: boolean;
}

const displayName = 'ColonyAvatar';

const ColonyAvatar = ({ colonyAddress, colony, showLink, preferThumbnail = true, ...avatarProps }: Props) => {
  const { metadata, name } = colony || {};
  const imageString = preferThumbnail ? metadata?.thumbnail : metadata?.avatar;
  const colonyAvatar = (
    <Avatar
      avatar={imageString}
      placeholderIcon="at-sign-circle"
      seed={colonyAddress && colonyAddress.toLowerCase()}
      title={metadata?.displayName || name || colonyAddress}
      {...avatarProps}
    />
  );
  if (showLink && name) {
    return <NavLink to={`/colony/${name}`}>{colonyAvatar}</NavLink>;
  }
  return colonyAvatar;
};

ColonyAvatar.displayName = displayName;

export default ColonyAvatar;
