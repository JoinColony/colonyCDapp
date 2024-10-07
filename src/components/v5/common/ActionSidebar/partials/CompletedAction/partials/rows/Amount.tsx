import { Coins } from '@phosphor-icons/react';
import React from 'react';

import { type Token } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

import { getFormattedTokenAmount } from '../utils.ts';

import ActionContent from './ActionContent.tsx';

const displayName = 'v5.common.CompletedAction.partials.AmountRow';

interface AmountRowProps {
  amount: string;
  token?: Token;
}

const AmountRow = ({ amount, token }: AmountRowProps) => {
  const formattedAmount = getFormattedTokenAmount(amount, token?.decimals);

  return (
    <ActionContent
      rowLabel={formatText({ id: 'actionSidebar.amount' })}
      tooltipContent={formatText({
        id: 'actionSidebar.tooltip.simplePayment.amount',
      })}
      RowIcon={Coins}
      rowContent={
        <div className="flex items-center gap-3">
          {formattedAmount}
          {token && (
            <div className="flex gap-1">
              <TokenAvatar
                size={18}
                tokenName={token.name}
                tokenAddress={token.tokenAddress}
                tokenAvatarSrc={token.avatar ?? undefined}
              />
              <span className="text-md">{token.symbol}</span>
            </div>
          )}
        </div>
      }
    />
  );
};

AmountRow.displayName = displayName;
export default AmountRow;
