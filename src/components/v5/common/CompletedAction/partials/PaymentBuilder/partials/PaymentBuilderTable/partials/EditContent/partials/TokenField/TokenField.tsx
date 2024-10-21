import clsx from 'clsx';
import React, { type FC } from 'react';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useGetAllTokens } from '~hooks/useGetAllTokens.ts';
import { getFormattedTokenAmount } from '~v5/common/CompletedAction/partials/utils.ts';
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
  const formattedAmount = getFormattedTokenAmount(
    amount,
    currentToken?.token.decimals || DEFAULT_TOKEN_DECIMALS,
  );

  return amount ? (
    <div className="flex items-center gap-1 text-3">
      <span
        className={clsx({
          'text-blue-400': isNew,
          'text-gray-900': !isNew,
        })}
      >
        {formattedAmount}
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
