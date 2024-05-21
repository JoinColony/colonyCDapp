import clsx from 'clsx';
import React, { type FC } from 'react';

import { useGetAllTokens } from '~hooks/useGetAllTokens.ts';
import { truncateTokenSymbol } from '~utils/strings.ts';

import { type TokenSymbolProps } from './types.ts';

const displayName =
  'v5.common.ActionsContent.partials.TokenSelect.partials.TokenSymbol';

const TokenSymbol: FC<TokenSymbolProps> = ({ address, disabled = false }) => {
  const allTokens = useGetAllTokens();

  const selectedToken = allTokens.find(
    ({ token }) => token.tokenAddress === address,
  )?.token;

  if (!selectedToken) {
    return null;
  }

  const { symbol } = selectedToken || {};

  return (
    <span className={clsx('text-md', { 'text-gray-300': disabled })}>
      {truncateTokenSymbol(symbol)}
    </span>
  );
};

TokenSymbol.displayName = displayName;

export default TokenSymbol;
