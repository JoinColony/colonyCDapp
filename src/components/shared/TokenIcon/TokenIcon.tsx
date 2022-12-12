import React from 'react';

import Avatar, { AvatarProps } from '~shared/Avatar';
import Icon from '~shared/Icon';
import { Token } from '~types';

interface Props extends Pick<AvatarProps, 'size'> {
  /** Is passed through to Icon / Avatar */
  className?: string;
  /** Name of svg to be rendered instead of token avatar */
  iconName?: string;
  /** Optional name for the icon title */
  title?: string;
  /** Token object */
  token: Token;
}

const TokenIcon = ({
  iconName,
  title,
  token: { tokenAddress: address, avatar, thumbnail, name: tokenName },
  ...props
}: Props) => {
  return (
    <>
      {iconName ? (
        <Icon name={iconName} title={title || address} {...props} />
      ) : (
        <Avatar
          // will render blockie if undefined
          avatar={thumbnail || avatar || undefined}
          seed={address}
          title={title || tokenName || address}
          {...props}
        />
      )}
    </>
  );
};

export default TokenIcon;
