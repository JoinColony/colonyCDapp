import React, { type FC } from 'react';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import TokenIcon from '~shared/TokenIcon/TokenIcon.tsx';
import { getSelectedToken } from '~utils/tokens.ts';

import { getFormattedTokenAmount } from '../../utils.ts';

import { type AmountProps } from './types.ts';

const AmountField: FC<AmountProps> = ({ amount, tokenAddress }) => {
  const { colony } = useColonyContext();
  const tokenData = getSelectedToken(colony, tokenAddress);
  const formattedAmount = getFormattedTokenAmount(
    amount,
    tokenData?.decimals || DEFAULT_TOKEN_DECIMALS,
  );

  return (
    <div className="flex items-center gap-3 text-md text-gray-900">
      {formattedAmount}
      {tokenData && (
        <div className="flex items-center gap-1">
          <TokenIcon token={tokenData} size="xxs" />
          {tokenData.symbol}
        </div>
      )}
    </div>
  );
};

export default AmountField;
