import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';

import { Avatar } from '../Avatar/Avatar.tsx';

const displayName = 'v5.shared.TokenAvatar';

const MSG = defineMessages({
  defaultAlt: {
    id: `${displayName}.tokenAvatarAlt`,
    defaultMessage: 'Avatar of token {name}',
  },
});

interface TokenAvatarProps {
  className?: string;
  size: number;
  tokenAddress: string;
  tokenAvatarSrc?: string;
  tokenName?: string;
}

export const TokenAvatar: FC<TokenAvatarProps> = ({
  className,
  size,
  tokenAddress,
  tokenAvatarSrc,
  tokenName,
}) => {
  return (
    <Avatar
      className={className}
      size={size}
      alt={formatText(MSG.defaultAlt, { name: tokenName ?? tokenAddress })}
      src={tokenAvatarSrc}
      address={tokenAddress}
    />
  );
};

TokenAvatar.displayName = displayName;
