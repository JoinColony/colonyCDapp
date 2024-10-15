import { type BigNumber } from 'ethers';
import React, { type FC } from 'react';

import Numeral from '~shared/Numeral/index.ts';
import { type Token } from '~types/graphql.ts';
import { multiLineTextEllipsis } from '~utils/strings.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

interface TokenItemProps {
  token: Token;
  tokenBalance?: BigNumber;
}

export const TokenItem: FC<TokenItemProps> = ({ token, tokenBalance }) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <TokenAvatar
          size={18}
          tokenName={token.name}
          tokenAddress={token.tokenAddress}
          tokenAvatarSrc={token.avatar ?? undefined}
        />
        <span className="text-md">
          {multiLineTextEllipsis(token.symbol, 5)}
        </span>
      </div>
      {tokenBalance && (
        <span className="ml-2 whitespace-nowrap text-sm text-gray-400">
          <Numeral
            value={tokenBalance}
            decimals={getTokenDecimalsWithFallback(token?.decimals)}
          />{' '}
          {multiLineTextEllipsis(token.symbol, 5)}
        </span>
      )}
    </>
  );
};
