import React, { type FC } from 'react';

import { useGetAllTokens } from '~hooks/useGetAllTokens.ts';
import { getFormattedTokenAmount } from '~v5/common/CompletedAction/partials/utils.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

import { type MilestoneItemProps } from './types.ts';

const MilestoneItem: FC<MilestoneItemProps> = ({
  amount,
  milestone,
  tokenAddress,
}) => {
  const allTokens = useGetAllTokens();
  const selectedToken = allTokens.find(
    ({ token }) => token.tokenAddress === tokenAddress,
  );
  const formattedAmount = getFormattedTokenAmount(
    amount,
    selectedToken?.token.decimals,
  );

  return (
    <div className="flex items-center justify-between gap-2 rounded bg-gray-50 px-3.5 py-3">
      <p className="truncate text-1">{milestone}</p>
      <div className="flex flex-shrink-0 items-center gap-2">
        <p className="text-md">{formattedAmount}</p>
        <div className="flex items-center gap-1">
          <TokenAvatar
            tokenAddress={selectedToken?.token.tokenAddress || ''}
            tokenAvatarSrc={selectedToken?.token.avatar ?? undefined}
            size={18}
          />
          <span className="text-md">{selectedToken?.token.symbol}</span>
        </div>
      </div>
    </div>
  );
};

export default MilestoneItem;
