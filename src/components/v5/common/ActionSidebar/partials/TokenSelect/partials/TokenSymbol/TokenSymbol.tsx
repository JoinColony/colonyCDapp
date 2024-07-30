import clsx from 'clsx';
import { isAddress } from 'ethers/lib/utils';
import React, { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetTokenFromEverywhereQuery } from '~gql';
import { getSelectedToken } from '~utils/tokens.ts';

import { type TokenSymbolProps } from './types.ts';

const displayName =
  'v5.common.ActionsContent.partials.TokenSelect.partials.TokenSymbol';

const TokenSymbol: FC<TokenSymbolProps> = ({ address, disabled = false }) => {
  const { colony } = useColonyContext();

  const tokenData = getSelectedToken(colony, address);

  const { data, loading } = useGetTokenFromEverywhereQuery({
    variables: {
      input: {
        tokenAddress: address,
      },
    },
    skip: !!tokenData || !isAddress(address),
  });

  if (loading) {
    return (
      <div className="h-[1.5rem] w-full max-w-[8.75rem] skeleton before:rounded" />
    );
  }

  const token = (tokenData || data?.getTokenFromEverywhere?.items?.[0]) ?? null;

  if (!token) {
    return null;
  }

  const { symbol } = token || {};

  return (
    <span
      className={clsx('line-clamp-5 text-md', { 'text-gray-300': disabled })}
    >
      {symbol}
    </span>
  );
};

TokenSymbol.displayName = displayName;

export default TokenSymbol;
