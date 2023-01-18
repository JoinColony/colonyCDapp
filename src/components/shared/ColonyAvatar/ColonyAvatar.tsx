import React from 'react';

import { Address, Colony } from '~types';
import Avatar, { AvatarProps } from '~shared/Avatar';
import NavLink from '~shared/NavLink';

import { Icons } from '~constants';

export interface Props
  extends Pick<AvatarProps, 'className' | 'notSet' | 'size'> {
  /** Address of the colony for identicon fallback */
  colonyAddress: Address;

  /** If true the UserAvatar links to the user's profile */
  showLink?: boolean;

  /** The corresponding user object if available */
  colony?: Colony;

  preferThumbnail?: boolean;
}

const displayName = 'ColonyAvatar';

const ColonyAvatar = ({
  colonyAddress,
  colony,
  showLink,
  preferThumbnail = true,
  ...avatarProps
}: Props) => {
  const { profile, name } = colony || {};
  const imageString = preferThumbnail ? profile?.thumbnail : profile?.avatar;
  const colonyAvatar = (
    <Avatar
      avatar={imageString}
      placeholderIcon={Icons.AtSignCircle}
      seed={colonyAddress && colonyAddress.toLowerCase()}
      title={profile?.displayName || name || colonyAddress}
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
