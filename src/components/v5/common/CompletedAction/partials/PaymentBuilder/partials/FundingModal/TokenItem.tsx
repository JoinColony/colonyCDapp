import React, { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import Numeral from '~shared/Numeral/Numeral.tsx';
import TokenIcon from '~shared/TokenIcon/TokenIcon.tsx';
import { formatText } from '~utils/intl.ts';
import { getSelectedToken } from '~utils/tokens.ts';

import { type TokenItemProps } from './types.ts';

const TokenItem: FC<TokenItemProps> = ({
  amount,
  networkFee,
  tokenAddress,
}) => {
  const { colony } = useColonyContext();
  const token = getSelectedToken(colony, tokenAddress);

  return (
    <div className="flex items-center justify-between gap-2">
      {token && (
        <div>
          <div className="flex items-center gap-1 text-3">
            <TokenIcon token={token} size="xxs" />
            {token.name}
          </div>
          <span className="mt-1 text-xs text-gray-600">
            {formatText({ id: 'fundingModal.fee' })}
          </span>
        </div>
      )}
      <div className="flex flex-col items-end gap-1">
        <span className="text-3">
          <Numeral value={amount} decimals={token?.decimals} /> {token?.symbol}
        </span>
        {networkFee && (
          <span className="text-xs text-gray-600">
            <Numeral value={networkFee} decimals={token?.decimals} />{' '}
            {token?.symbol}
          </span>
        )}
      </div>
    </div>
  );
};

export default TokenItem;
