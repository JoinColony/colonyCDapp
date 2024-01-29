import React from 'react';

import Avatar, { AvatarProps } from '~shared/Avatar/index.ts';
import NavLink from '~shared/NavLink/index.ts';
import { Colony } from '~types/graphql.ts';
import { Address } from '~types/index.ts';

export interface Props
  extends Pick<AvatarProps, 'className' | 'notSet' | 'size'> {
  /** Address of the colony for identicon fallback */
  colonyAddress: Address;

  /** If true the UserAvatar links to the user's profile */
  showLink?: boolean;

  /** The colony this avatar is for */
  colony?: Colony;

  /** Use the thumbnail instead of the avatar image */
  preferThumbnail?: boolean;
  externalAvatar?: string;
}

const displayName = 'ColonyAvatar';

const ColonyAvatar = ({
  colonyAddress,
  colony,
  showLink,
  externalAvatar,
  preferThumbnail = true,
  ...avatarProps
}: Props) => {
  const { metadata, name } = colony || {};
  const imageString = preferThumbnail ? metadata?.thumbnail : metadata?.avatar;
  const colonyAvatar = (
    <Avatar
      avatar={externalAvatar || imageString}
      placeholderIcon="at-sign-circle"
      seed={colonyAddress && colonyAddress.toLowerCase()}
      title={metadata?.displayName || name || colonyAddress}
      {...avatarProps}
    />
  );

  if (showLink && name) {
    return <NavLink to={`/${name}`}>{colonyAvatar}</NavLink>;
  }

  return colonyAvatar;
};

ColonyAvatar.displayName = displayName;

export default ColonyAvatar;
