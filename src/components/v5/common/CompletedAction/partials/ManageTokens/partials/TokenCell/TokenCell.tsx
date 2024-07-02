import { isAddress } from 'ethers/lib/utils';
import React, { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetTokenFromEverywhereQuery } from '~gql';
import { useTablet } from '~hooks';
import { formatText } from '~utils/intl.ts';
import { getSelectedToken } from '~utils/tokens.ts';
import TokenStatus from '~v5/common/ActionSidebar/partials/TokenSelect/partials/TokenStatus/TokenStatus.tsx';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

import TokenStatusPill from '../TokenStatusPill/TokenStatusPill.tsx';

import { type TokenCellProps } from './types.ts';

const TokenCell: FC<TokenCellProps> = ({
  tokenAddress,
  status,
  isSymbolCell,
}) => {
  const { colony } = useColonyContext();
  const isTablet = useTablet();

  const tokenData = getSelectedToken(colony, tokenAddress);

  const { data, loading } = useGetTokenFromEverywhereQuery({
    variables: {
      input: {
        tokenAddress,
      },
    },
    skip: !!tokenData || !isAddress(tokenAddress),
  });

  if (loading) {
    return (
      <div className="h-[1.5rem] w-full max-w-[8.75rem] skeleton before:rounded" />
    );
  }

  const token = (tokenData || data?.getTokenFromEverywhere?.items?.[0]) ?? null;

  if (isSymbolCell) {
    return (
      <div className="flex w-full flex-col items-start gap-2 text-gray-900 text-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        {token?.symbol}
        {!isTablet && <TokenStatusPill status={status} />}
      </div>
    );
  }

  const tokenInfoContent = (
    <div className="flex w-full items-center gap-2 truncate text-gray-900 text-1">
      {token ? (
        <>
          <TokenAvatar
            size={18}
            tokenName={token.name}
            tokenAddress={token.tokenAddress}
            tokenAvatarSrc={token?.avatar ?? undefined}
          />
          <p className="truncate">{token?.name || tokenAddress}</p>
        </>
      ) : (
        <TokenStatus status="error">
          {formatText({ id: 'manageTokensTable.notFound' })}
        </TokenStatus>
      )}
    </div>
  );

  return isTablet ? (
    <div className="flex items-center justify-between gap-2">
      {tokenInfoContent}
      <TokenStatusPill status={status} />
    </div>
  ) : (
    tokenInfoContent
  );
};

export default TokenCell;
