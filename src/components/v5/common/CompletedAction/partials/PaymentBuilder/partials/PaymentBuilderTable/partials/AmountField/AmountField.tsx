import React, { type FC } from 'react';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import TokenIcon from '~shared/TokenIcon/TokenIcon.tsx';
import { getSelectedToken } from '~utils/tokens.ts';

import { getFormattedTokenAmount } from '../../../../../utils.ts';

import { type AmountFieldProps } from './types.ts';

const AmountField: FC<AmountFieldProps> = ({
  amount,
  tokenAddress,
  isLoading,
}) => {
  const { colony } = useColonyContext();
  const tokenData = getSelectedToken(colony, tokenAddress);
  const formattedAmount = getFormattedTokenAmount(
    amount,
    tokenData?.decimals || DEFAULT_TOKEN_DECIMALS,
  );

  return !isLoading ? (
    <div className="flex items-center gap-3 text-md text-gray-900">
      {formattedAmount}
      {tokenData && (
        <div className="flex items-center gap-1">
          <TokenIcon token={tokenData} size="xxs" />
          {tokenData.symbol}
        </div>
      )}
    </div>
  ) : (
    <div className="flex w-[11.25rem] items-center">
      <div className="h-4 w-full overflow-hidden rounded skeleton" />
    </div>
  );
};

export default AmountField;
