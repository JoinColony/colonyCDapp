import { type Icon } from '@phosphor-icons/react';
import React from 'react';

import Avatar, { type AvatarProps } from '~shared/Avatar/index.ts';
import { type Token } from '~types/graphql.ts';

interface Props extends Pick<AvatarProps, 'size'> {
  /** Is passed through to Icon / Avatar */
  className?: string;
  /** Name of svg to be rendered instead of token avatar */
  icon?: Icon;
  /** Optional name for the icon title */
  title?: string;
  /** Token object */
  token: Token;
}

// @TODO: When refactoring Avatar, we should sort that out. Probably also get rid of all Avatar sizes, just like the Icon
const AVATAR_ICON_SIZES = {
  xxxs: 16,
  xxs: 18,
  xs: 26,
  m: 60,
};

const TokenIcon = ({
  icon: Icon,
  title,
  token: { tokenAddress: address, avatar, thumbnail, name: tokenName },
  ...props
}: Props) => {
  return (
    <>
      {Icon ? (
        <Icon size={AVATAR_ICON_SIZES[props.size || 'xxs']}>
          <title>{title || address}</title>
        </Icon>
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
