import React, { type FC } from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { getSelectedToken } from '~utils/tokens.ts';
import { getFormattedTokenAmount } from '~v5/common/ActionSidebar/partials/CompletedAction/partials/utils.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

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

  return (
    <LoadingSkeleton isLoading={isLoading} className="h-4 w-[11.25rem] rounded">
      <div className="flex items-center gap-3 text-md text-gray-900">
        {formattedAmount}
        {tokenData && (
          <div className="flex items-center gap-1">
            <TokenAvatar
              tokenAddress={tokenData.tokenAddress}
              tokenAvatarSrc={tokenData.avatar ?? undefined}
              tokenName={tokenData.name}
              size={18}
            />
            {tokenData.symbol}
          </div>
        )}
      </div>
    </LoadingSkeleton>
  );
};

export default AmountField;
