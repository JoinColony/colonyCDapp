import { Id } from '@colony/colony-js';
import React, { type FC } from 'react';

import { type ColonyBalancesFragment } from '~gql';
import { type Token } from '~types/graphql.ts';
import { getBalanceForTokenAndDomain } from '~utils/tokens.ts';
import HoverWidthWrapper from '~v5/shared/HoverWidthWrapper/HoverWidthWrapper.tsx';

import { TokenItem } from './TokenItem.tsx';

interface TokenListProps {
  tokens: Token[];
  domainId?: number;
  balances?: ColonyBalancesFragment | null;
  onSelect: (selectedTokenAddress: string) => void;
}

export const TokenList: FC<TokenListProps> = ({
  tokens: colonyTokens,
  domainId,
  balances: colonyBalances,
  onSelect,
}) => {
  return (
    <ul className="h-full overflow-y-auto" data-testid="token-list">
      {colonyTokens.map((colonyToken) => {
        const tokenBalance = getBalanceForTokenAndDomain({
          balances: colonyBalances,
          tokenAddress: colonyToken.tokenAddress,
          tokenChainId: colonyToken.chainMetadata.chainId,
          domainId: domainId ?? Id.RootDomain,
        });

        return (
          <li
            key={colonyToken.tokenAddress}
            className="mb-1 last:mb-0"
            data-testid="token-list-item"
          >
            <HoverWidthWrapper hoverClassName="font-medium block">
              <button
                type="button"
                className={`flex w-full items-center justify-between
                        gap-1 rounded-lg px-4 py-2 transition-colors
                        md:hover:bg-gray-50 md:hover:font-medium`}
                onClick={() => onSelect(colonyToken.tokenAddress)}
              >
                <TokenItem
                  token={colonyToken}
                  tokenBalance={tokenBalance}
                  className="gap-2"
                />
              </button>
            </HoverWidthWrapper>
          </li>
        );
      })}
    </ul>
  );
};
