import React, { FC } from 'react';

import { useGetAllTokens } from '~hooks/useGetAllTokens.ts';

import { TokenSymbolProps } from './types.ts';

const displayName =
  'v5.common.ActionsContent.partials.TokenSelect.partials.TokenSymbol';

const TokenSymbol: FC<TokenSymbolProps> = ({ address }) => {
  const allTokens = useGetAllTokens();

  const selectedToken = allTokens.find(
    ({ token }) => token.tokenAddress === address,
  )?.token;

  if (!selectedToken) {
    return null;
  }

  const { symbol } = selectedToken || {};

  return <span className="text-md">{symbol}</span>;
};

TokenSymbol.displayName = displayName;

export default TokenSymbol;
