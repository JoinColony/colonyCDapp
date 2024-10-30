import clsx from 'clsx';
import React, { type FC } from 'react';

import { useGetAllTokens } from '~hooks/useGetAllTokens.ts';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

interface TokenFieldProps {
  tokenAddress: string;
  amount: string;
  isNew: boolean;
}

const TokenField: FC<TokenFieldProps> = ({ amount, tokenAddress, isNew }) => {
  const allTokens = useGetAllTokens();
  const currentToken = allTokens.find(
    ({ token }) => token.tokenAddress === tokenAddress,
  );

  return amount ? (
    <div className="flex items-center gap-1 text-3">
      <span
        className={clsx({
          'text-blue-400': isNew,
          'text-gray-900': !isNew,
        })}
      >
        <Numeral
          value={amount}
          decimals={getTokenDecimalsWithFallback(currentToken?.token.decimals)}
        />
      </span>
      <TokenAvatar
        tokenAddress={currentToken?.token.tokenAddress || ''}
        size={18}
        tokenAvatarSrc={currentToken?.token.avatar || ''}
      />
      <span>{currentToken?.token.symbol}</span>
    </div>
  ) : (
    <p className="text-3">-</p>
  );
};

export default TokenField;
