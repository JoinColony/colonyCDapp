import React, { type FC } from 'react';

import { Avatar2 } from '../Avatar/Avatar.tsx';

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
    <Avatar2
      className={className}
      size={size}
      alt={`Avatar of token ${tokenName ?? tokenAddress}`}
      src={tokenAvatarSrc}
      address={tokenAddress}
    />
  );
};
