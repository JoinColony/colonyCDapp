import clsx from 'clsx';
import React, { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import Numeral from '~shared/Numeral/Numeral.tsx';
import {
  getSelectedToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

interface TokenFieldProps {
  tokenAddress: string;
  amount: string;
  isNew: boolean;
}

const TokenField: FC<TokenFieldProps> = ({ amount, tokenAddress, isNew }) => {
  const { colony } = useColonyContext();
  const tokenData = getSelectedToken(colony, tokenAddress);

  return amount && amount !== '0' ? (
    <div className="flex items-center gap-1 text-3">
      <span
        className={clsx({
          'text-blue-400': isNew,
          'text-gray-900': !isNew,
        })}
      >
        <Numeral
          value={amount}
          decimals={getTokenDecimalsWithFallback(tokenData?.decimals)}
        />
      </span>
      <TokenAvatar
        tokenAddress={tokenData?.tokenAddress || ''}
        size={18}
        tokenAvatarSrc={tokenData?.avatar || undefined}
      />
      <span>{tokenData?.symbol}</span>
    </div>
  ) : (
    <p className="text-3">-</p>
  );
};

export default TokenField;
